# Steam Verify Backend

Backend for Steam ID verification on uCoz profile pages.

## Install

1. `npm install`
2. Copy `.env.example` to `.env`, insert your Steam API Key
3. `npm start`

## Deploy on Render

1. Create Web Service from this repo
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Add environment variable `STEAM_API_KEY`

## API

- `GET /api/steam/status?userId=123` - verification status
- `POST /api/steam/save` - save Steam ID and get code `{ userId, steamId }`
- `POST /api/steam/verify` - verify code in Steam profile `{ userId }`
- `POST /api/steam/reset` - reset `{ userId }`
