# Steam Verify Backend

## Переменные окружения
- STEAM_API_KEY — получите на https://steamcommunity.com/dev/apikey

## Деплой на Render
1. Build Command: npm install
2. Start Command: node server.js
3. Environment Variables: STEAM_API_KEY

## API
- GET / — статус
- POST /api/steam/save — сохранить Steam ID, получить код
- GET /api/steam/status/:userId — статус верификации
- POST /api/steam/verify — проверить код в профиле Steam