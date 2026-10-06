const express = require('express');
const sqlite3 = require('better-sqlite3');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const STEAM_API_KEY = process.env.STEAM_API_KEY;

app.use(cors());
app.use(express.json());

// --- SQLite ---
const db = new sqlite3('steam_verify.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS steam_verifications (
    user_id     TEXT PRIMARY KEY,
    steam_id    TEXT NOT NULL,
    verify_code TEXT,
    verified    INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
  )
`);

// --- Helpers ---

// Конвертация STEAM_0:x:yyy -> Steam64 ID
function steamId2To64(steamId) {
  if (steamId.startsWith('STEAM_')) {
    const parts = steamId.split(':');
    if (parts.length === 3) {
      const accountId = (BigInt(parts[2]) * 2n) + BigInt(parts[1]);
      const base = 76561197960265728n;
      return (base + accountId).toString();
    }
  }
  return steamId;
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let p1 = '', p2 = '';
  for (let i = 0; i < 5; i++) p1 += chars[Math.floor(Math.random() * chars.length)];
  for (let i = 0; i < 5; i++) p2 += chars[Math.floor(Math.random() * chars.length)];
  return 'APEX-' + p1 + '-' + p2;
}

// --- Routes ---

// GET /api/steam/status?userId=123
app.get('/api/steam/status', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const row = db.prepare('SELECT * FROM steam_verifications WHERE user_id = ?').get(userId);
  if (!row) return res.json({ steamId: '', verified: false, verifyCode: '' });

  res.json({
    steamId: row.steam_id,
    verified: row.verified === 1,
    verifyCode: row.verify_code || ''
  });
});

// POST /api/steam/save  body: { userId, steamId }
app.post('/api/steam/save', (req, res) => {
  const { userId, steamId } = req.body;
  if (!userId || !steamId) return res.status(400).json({ error: 'userId and steamId required' });

  const code = generateCode();
  db.prepare(`
    INSERT INTO steam_verifications (user_id, steam_id, verify_code, verified, updated_at)
    VALUES (?, ?, ?, 0, datetime('now'))
    ON CONFLICT(user_id) DO UPDATE SET
      steam_id = excluded.steam_id,
      verify_code = excluded.verify_code,
      verified = 0,
      updated_at = datetime('now')
  `).run(userId, steamId.trim(), code);

  res.json({ verifyCode: code });
});

// POST /api/steam/verify  body: { userId }
app.post('/api/steam/verify', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const row = db.prepare('SELECT * FROM steam_verifications WHERE user_id = ?').get(userId);
  if (!row) return res.status(404).json({ error: 'Сначала сохраните Steam ID' });
  if (!row.verify_code) return res.status(400).json({ error: 'Код не сгенерирован' });

  const steam64 = steamId2To64(row.steam_id);

  try {
    const url = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=' + STEAM_API_KEY + '&steamids=' + steam64;
    const resp = await fetch(url);
    const data = await resp.json();

    const players = data.response && data.response.players;
    if (!players || players.length === 0) {
      return res.status(404).json({ error: 'Профиль Steam не найден. Проверьте Steam ID.' });
    }

    const profile = players[0];
    const summary = profile.profilesummary || profile.realname || '';

    if (summary.includes(row.verify_code)) {
      db.prepare(`
        UPDATE steam_verifications
        SET verified = 1, updated_at = datetime('now')
        WHERE user_id = ?
      `).run(userId);

      return res.json({
        verified: true,
        profileUrl: profile.profileurl,
        persona: profile.personaname
      });
    } else {
      return res.status(400).json({
        error: 'Код не найден в профиле Steam. Убедитесь, что вы вставили код в поле "О себе" и сохранили профиль.'
      });
    }
  } catch (err) {
    console.error('Steam API error:', err);
    return res.status(500).json({ error: 'Ошибка при обращении к Steam API. Попробуйте позже.' });
  }
});

// POST /api/steam/reset  body: { userId }
app.post('/api/steam/reset', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  db.prepare('DELETE FROM steam_verifications WHERE user_id = ?').run(userId);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log('Steam Verify server running on port ' + PORT);
});
