require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (e) {
  console.error('Ошибка инициализации Firebase:', e);
  process.exit(1);
}

const db = admin.database();

app.get('/health', async (req, res) => {
  try {
    const snapshot = await db.ref('/').once('value');
    res.json({ status: 'ok', keys: Object.keys(snapshot.val() || {}) });
  } catch (e) {
    console.error('Firebase error:', e);
    res.status(500).json({ status: 'error', message: e.message });
  }
});

app.post('/verify-steam', async (req, res) => {
  const { userId, steamCode } = req.body;
  if (!userId || !steamCode) {
    return res.status(400).json({ error: 'userId и steamCode обязательны' });
  }
  try {
    const ref = db.ref(`users/${userId}/verification`);
    await ref.update({
      code: steamCode.trim(),
      status: 'pending',
      updatedAt: new Date().toISOString(),
    });
    res.json({ status: 'ok', message: 'Код отправлен на проверку', userId });
  } catch (e) {
    console.error('Firebase write error:', e);
    res.status(500).json({ error: 'Ошибка записи в Firebase', details: e.message });
  }
});

app.get('/user-status/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const snapshot = await db.ref(`users/${userId}/verification`).once('value');
    const data = snapshot.val();
    res.json(data || { status: 'none' });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка чтения статуса', details: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
