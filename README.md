# Go Run

Local running companion built with Next.js and next-intl.

## Features

- Log activities manually (date, distance, duration)
- Optional Strava connection and sync into the local log
- Dashboard with stats, table, and charts
- Pace calculator
- Training program generator
- Unit toggle (km/mi) and i18n (en/fr)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Connection with Strava (optional)

For the Strava app setup walkthrough, see:
[Strava app setup guide](https://developers.strava.com/docs/getting-started/#account)

1. Create a Strava app and set the redirect URI to:
   `http://localhost:3000/api/strava/callback`

2. Create `.env.local`:

```bash
STRAVA_CLIENT_ID=your_id
STRAVA_CLIENT_SECRET=your_secret
```

3. Click "Connect with Strava" in the app.

Tokens are stored locally in `.strava-token.json` (gitignored). Delete the file
to disconnect.

## Author

Liam Le Ny
