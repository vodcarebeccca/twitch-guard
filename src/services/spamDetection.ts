import { SPAM_PATTERNS, SPAM_KEYWORDS } from '../constants';

interface SpamResult {
  isSpam: boolean;
  score: number;
  reasons: string[];
  hasLink: boolean;
}

interface DetectionOptions {
  customBlacklist?: string[];
  blockAllLinks?: boolean;
  allowedDomains?: string[];
}

// Link detection patterns
const LINK_PATTERNS = [
  /https?:\/\/[^\s]+/gi,                    // http/https links
  /www\.[^\s]+/gi,                          // www links
  /[a-zA-Z0-9-]+\.(com|net|org|io|tv|gg|me|co|xyz|info|biz|ru|cn|tk|ml|ga|cf|gq|link|click|live|stream|pro|vip|top|site|online|store|shop|app|dev|tech|cloud|space|fun|world|today|news|blog|video|watch|play|game|bet|casino|porn|xxx|adult|sex|dating|meet|chat|social|money|cash|free|win|prize|gift|offer|deal|discount|sale|buy|sell|trade|crypto|bitcoin|nft|token|coin|wallet|invest|profit|earn|income|rich|wealth|million|billion)[^\s]*/gi,
  /bit\.ly|tinyurl|goo\.gl|t\.co|shorturl|rebrand\.ly|cutt\.ly|is\.gd|v\.gd|clck\.ru|qps\.ru/gi,  // URL shorteners
  /discord\.gg\/[^\s]+/gi,                  // Discord invites
  /twitch\.tv\/[^\s]+/gi,                   // Twitch links
  /youtube\.com|youtu\.be/gi,               // YouTube links
];

// Whitelist domains (safe by default)
const DEFAULT_SAFE_DOMAINS = [
  'twitch.tv',
  'clips.twitch.tv',
  'twitter.com',
  'x.com',
];

export const detectSpam = (
  message: string,
  options: DetectionOptions = {}
): SpamResult => {
  const { 
    customBlacklist = [], 
    blockAllLinks = false,
    allowedDomains = DEFAULT_SAFE_DOMAINS 
  } = options;
  
  const reasons: string[] = [];
  let score = 0;
  let hasLink = false;
  const lowerMsg = message.toLowerCase();

  // Check for links
  for (const pattern of LINK_PATTERNS) {
    const matches = message.match(pattern);
    if (matches) {
      hasLink = true;
      
      for (const link of matches) {
        const linkLower = link.toLowerCase();
        const isAllowed = allowedDomains.some(domain => linkLower.includes(domain.toLowerCase()));
        
        if (blockAllLinks && !isAllowed) {
          score += 50;
          reasons.push(`Link blocked: ${link.slice(0, 30)}...`);
        } else if (!isAllowed) {
          // Check if it's a suspicious shortener
          if (/bit\.ly|tinyurl|goo\.gl|t\.co|shorturl|rebrand\.ly|cutt\.ly|is\.gd|v\.gd/i.test(link)) {
            score += 35;
            reasons.push(`Suspicious shortener: ${link.slice(0, 25)}`);
          }
        }
      }
    }
  }

  // Check spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(message)) {
      score += 30;
      reasons.push(`Pattern: ${pattern.source.slice(0, 20)}...`);
    }
  }

  // Check keywords
  for (const keyword of SPAM_KEYWORDS) {
    if (lowerMsg.includes(keyword.toLowerCase())) {
      score += 25;
      reasons.push(`Keyword: ${keyword}`);
    }
  }

  // Check custom blacklist
  for (const word of customBlacklist) {
    if (word && lowerMsg.includes(word.toLowerCase())) {
      score += 40;
      reasons.push(`Blacklist: ${word}`);
    }
  }

  // Check for excessive caps
  const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
  if (capsRatio > 0.7 && message.length > 10) {
    score += 15;
    reasons.push('Excessive caps');
  }

  // Check for excessive emotes/symbols
  const symbolRatio = (message.match(/[^\w\s]/g) || []).length / message.length;
  if (symbolRatio > 0.5 && message.length > 5) {
    score += 10;
    reasons.push('Excessive symbols');
  }

  // Check for repeated messages pattern (same char repeated)
  if (/(.)\1{7,}/i.test(message)) {
    score += 20;
    reasons.push('Repeated characters');
  }

  return {
    isSpam: score >= 50,
    score: Math.min(score, 100),
    reasons,
    hasLink,
  };
};

// Helper to check if message contains any link
export const containsLink = (message: string): boolean => {
  return LINK_PATTERNS.some(pattern => pattern.test(message));
};

// Helper to extract all links from message
export const extractLinks = (message: string): string[] => {
  const links: string[] = [];
  for (const pattern of LINK_PATTERNS) {
    const matches = message.match(pattern);
    if (matches) {
      links.push(...matches);
    }
  }
  return [...new Set(links)];
};
