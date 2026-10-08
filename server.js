const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;
const STEAM_API_KEY = process.env.STEAM_API_KEY || '';

// JSON-файл как база данных (вместо SQLite)
const DB_FILE = path.join(__dirname, 'data', 'steam_verify.json');

// Убедиться, что папка data существует
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({}), 'utf-8');
}

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    return {};
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Статус API
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Steam Verify API is running' });
});

// === НОВЫЙ ЭНДПОИНТ: /verify — принимает steamId + code напрямую из Firebase ===
app.post('/verify', async (req, res) => {
  const { steamId, code } = req.body;

  if (!steamId || !code) {
    return res.status(400).json({ error: 'steamId и code обязательны' });
  }

  const steamIdTrimmed = steamId.trim();
  const codeTrimmed = code.trim();

  if (!steamIdTrimmed || !codeTrimmed) {
    return res.status(400).json({ error: 'steamId и code не могут быть пустыми' });
  }

  const steamId64 = resolveSteamId64(steamIdTrimmed);
  if (!steamId64) {
    return res.status(400).json({ error: 'Неверный формат Steam ID' });
  }

  try {
    const profileSummary = await getSteamPlayerSummary(steamId64);
    if (profileSummary === null) {
      return res.status(404).json({ error: 'Профиль Steam не найден или скрыт' });
    }

    if (profileSummary.includes(codeTrimmed)) {
      return res.json({ verified: true, message: 'Steam ID подтверждён!', steamId: steamIdTrimmed });
    } else {
      return res.status(400).json({ verified: false, error: 'Код не найден в профиле Steam. Убедитесь, что вы сохранили изменения в профиле Steam.' });
    }
  } catch (err) {
    console.error('Steam API error:', err.message);
    return res.status(500).json({ error: 'Ошибка при обращении к Steam API: ' + err.message });
  }
});

// Сохранить Steam ID и сгенерировать код (старый эндпоинт — оставлен для совместимости)
app.post('/api/steam/save', (req, res) => {
  const { userId, steamId } = req.body;
  if (!userId || !steamId) {
    return res.status(400).json({ error: 'userId и steamId обязательны' });
  }

  const steamIdTrimmed = steamId.trim();
  if (!steamIdTrimmed) {
    return res.status(400).json({ error: 'Steam ID не может быть пустым' });
  }

  const db = readDB();
  const verifyCode = 'APEX-' + crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 5) + '-' + crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 5);

  db[userId] = {
    steamId: steamIdTrimmed,
    verifyCode: verifyCode,
    verified: false,
    createdAt: new Date().toISOString(),
    verifiedAt: null
  };
  writeDB(db);

  res.json({ success: true, verifyCode: verifyCode });
});

// Получить статус верификации (старый эндпоинт)
app.get('/api/steam/status/:userId', (req, res) => {
  const db = readDB();
  const record = db[req.params.userId];
  if (!record) {
    return res.json({ found: false });
  }
  res.json({
    found: true,
    steamId: record.steamId,
    verified: record.verified,
    verifyCode: record.verified ? null : record.verifyCode
  });
});

// Проверить код в профиле Steam через Steam Web API (старый эндпоинт)
app.post('/api/steam/verify', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId обязателен' });
  }

  const db = readDB();
  const record = db[userId];
  if (!record) {
    return res.status(404).json({ error: 'Сначала сохраните Steam ID' });
  }
  if (record.verified) {
    return res.json({ success: true, message: 'Уже подтверждён', steamId: record.steamId });
  }

  const steamId64 = resolveSteamId64(record.steamId);
  if (!steamId64) {
    return res.status(400).json({ error: 'Неверный формат Steam ID' });
  }

  try {
    const profileSummary = await getSteamPlayerSummary(steamId64);
    if (profileSummary === null) {
      return res.status(404).json({ error: 'Профиль Steam не найден или скрыт' });
    }

    if (profileSummary.includes(record.verifyCode)) {
      record.verified = true;
      record.verifiedAt = new Date().toISOString();
      writeDB(db);
      return res.json({ success: true, message: 'Steam ID подтверждён!', steamId: record.steamId });
    } else {
      return res.status(400).json({ error: 'Код не найден в профиле Steam. Убедитесь, что вы сохранили изменения в профиле Steam.' });
    }
  } catch (err) {
    console.error('Steam API error:', err.message);
    return res.status(500).json({ error: 'Ошибка при обращении к Steam API: ' + err.message });
  }
});

// Преобразование Steam ID в формат SteamID64
function resolveSteamId64(steamId) {
  steamId = steamId.trim();

  // Уже SteamID64
  if (/^\d{17}$/.test(steamId)) {
    return steamId;
  }

  // SteamID (STEAM_0:1:2345678)
  if (steamId.indexOf('STEAM_') === 0) {
    const parts = steamId.split(':');
    if (parts.length === 3) {
      const authServer = parseInt(parts[1]);
      const accountId = parseInt(parts[2]);
      const result = BigInt(76561197960265728) + BigInt(accountId * 2 + authServer);
      return result.toString();
    }
  }

  // steamID3 ([U:1:12345678])
  if (steamId.indexOf('[U:1:') === 0) {
    const match = steamId.match(/\[U:1:(\d+)\]/);
    if (match) {
      const accountId = parseInt(match[1]);
      const result = BigInt(76561197960265728) + BigInt(accountId);
      return result.toString();
    }
  }

  return null;
}

// Запрос к Steam Web API
function getSteamPlayerSummary(steamId64) {
  return new Promise((resolve, reject) => {
    if (!STEAM_API_KEY) {
      return reject(new Error('STEAM_API_KEY не задан на сервере'));
    }

    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamId64}`;

    https.get(url, (apiRes) => {
      let body = '';
      apiRes.on('data', (chunk) => { body += chunk; });
      apiRes.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (!data.response || !data.response.players || data.response.players.length === 0) {
            return resolve(null);
          }
          const player = data.response.players[0];
          resolve(player.profilesummary || '');
        } catch (e) {
          reject(new Error('Не удалось разобрать ответ Steam API'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

app.listen(PORT, () => {
  console.log(`Steam Verify API running on port ${PORT}`);
});
