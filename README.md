# TwitchGuard 🛡️

AI-Powered Chat Moderation Bot for Twitch Streamers

![TwitchGuard](https://img.shields.io/badge/Twitch-9146FF?style=for-the-badge&logo=twitch&logoColor=white)

## Features

- 🤖 **AI Spam Detection** - Automatically detect spam, scam links, and bot messages
- ⚡ **Real-time Monitoring** - WebSocket-based chat monitoring
- 🚫 **Auto Moderation** - Auto-delete, timeout, and ban spammers
- 📊 **Analytics Dashboard** - Track moderation stats and activity
- 🎨 **Modern UI** - Beautiful dark theme with Twitch branding

## Setup

### 1. Create Twitch Application

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Click "Register Your Application"
3. Fill in:
   - **Name**: TwitchGuard
   - **OAuth Redirect URLs**: `http://localhost:5173/callback`
   - **Category**: Chat Bot
4. Click Create and copy your **Client ID**

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Client ID:
```
VITE_TWITCH_CLIENT_ID=your_client_id_here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- tmi.js (Twitch chat)
- Lucide Icons

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variable: `VITE_TWITCH_CLIENT_ID`
4. Update Twitch OAuth redirect URL to your Vercel domain

## License

MIT - Created by ZIVER RFL
