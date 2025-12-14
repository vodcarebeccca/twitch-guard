// Twitch OAuth Config
export const TWITCH_CONFIG = {
  clientId: import.meta.env.VITE_TWITCH_CLIENT_ID || 'YOUR_TWITCH_CLIENT_ID',
  redirectUri: typeof window !== 'undefined' 
    ? `${window.location.origin}/callback` 
    : 'http://localhost:5173/callback',
  scopes: [
    'chat:read',
    'chat:edit', 
    'moderator:manage:banned_users',
    'moderator:manage:chat_messages',
    'user:read:email',
  ].join(' '),
};

// Spam detection patterns
export const SPAM_PATTERNS = [
  /free\s*(followers?|viewers?|subs?)/i,
  /bit\.ly|tinyurl|goo\.gl/i,
  /buy\s*(followers?|viewers?)/i,
  /\$\d+.*followers?/i,
  /follow\s*4\s*follow/i,
  /check\s*my\s*(bio|profile|channel)/i,
  /(.)\1{5,}/i, // Repeated characters
  /[A-Z]{10,}/i, // All caps spam
];

export const SPAM_KEYWORDS = [
  'free followers', 'free viewers', 'buy followers',
  'cheap followers', 'bigfollows', 'followersup',
  'viewerbot', 'follow4follow', 'f4f',
];
