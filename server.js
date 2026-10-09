require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Путь к файлу ключа (должен лежать в корне репозитория)
const keyPath = path.join(__dirname, 'serviceAccountKey.json');

try {
  const rawData = fs.readFileSync(keyPath, 'utf8');
  const serviceAccount = JSON.parse(rawData);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase успешно инициализирован из файла');
} catch (e) {
  console.error('❌ Ошибка инициализации Firebase:', e.message);
  // Для отладки можно раскомментировать, чтобы видеть детали:
  // console.error(e);
  process.exit(1);
}

const db = admin.database();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server running with Firebase' });
});

// Пример запроса (теперь реально пишет в Firebase)
app.post('/verify-steam', async (req, res) => {
  const { userId, steamCode } = req.body;
  if (!userId || !steamCode) {
    return res.status(400).json({ error: 'userId и steamCode обязательны' });
  }

  try {
    // Пример записи в базу (путь под себя можно поменять)
    await db.ref(`users/${userId}`).set({
      steamCode,
      verified: false,
      timestamp: new Date().toISOString(),
    });
    console.log(`✅ Данные для ${userId} сохранены в Firebase`);
    res.json({
      status: 'ok',
      message: 'Данные сохранены в Firebase',
      userId,
    });
  } catch (err) {
    console.error('❌ Ошибка записи в Firebase:', err.message);
    res.status(500).json({ error: 'Ошибка записи в базу данных' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
