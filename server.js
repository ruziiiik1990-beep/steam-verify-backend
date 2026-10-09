const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Данные прямо в коде — никакого внешнего JSON
const profileData = {
  steamId: '76561198000000001',
  nickname: 'CyberKnight',
  rank: 'Gold I',
  totalMatches: 127,
  wins: 83
};

const achievementsData = [
  { id: 1, name: 'Новичок', description: 'Сыграл первый матч', progress: 100 },
  { id: 2, name: 'Серия побед', description: '5 побед подряд', progress: 75 },
  { id: 3, name: 'Мастер карт', description: 'Отыграл все карты турнира', progress: 40 }
];

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Сервер работает без Firebase и без внешних файлов',
    endpoints: {
      profile: '/api/profile',
      achievements: '/api/achievements'
    }
  });
});

app.get('/api/profile', (req, res) => {
  res.json(profileData);
});

app.get('/api/achievements', (req, res) => {
  res.json(achievementsData);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
