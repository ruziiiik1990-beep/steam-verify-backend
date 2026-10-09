require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server running (Firebase disabled for debug)' });
});

// Verify Steam (заглушка вместо записи в Firebase)
app.post('/verify-steam', (req, res) => {
  const { userId, steamCode } = req.body;
  if (!userId || !steamCode) {
    return res.status(400).json({ error: 'userId и steamCode обязательны' });
  }
  console.log(`[DEBUG] Запрос верификации: userId=${userId}, код получен (Firebase отключён)`);
  res.json({
    status: 'ok',
    message: 'Запрос принят (данные не сохраняются — Firebase отключён)',
    userId,
  });
});

// User status (заглушка)
app.get('/user-status/:userId', (req, res) => {
  const { userId } = req.params;
  console.log(`[DEBUG] Запрос статуса для userId=${userId} (Firebase отключён)`);
  res.json({
    userId,
    status: 'pending',
    debug: 'Firebase отключён для устранения ошибки Invalid PEM',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
