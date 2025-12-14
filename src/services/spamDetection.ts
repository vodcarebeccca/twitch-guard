import { SPAM_PATTERNS, SPAM_KEYWORDS } from '../constants';

interface SpamResult {
  isSpam: boolean;
  score: number;
  reasons: string[];
}

export const detectSpam = (
  message: string,
  customBlacklist: string[] = []
): SpamResult => {
  const reasons: string[] = [];
  let score = 0;
  const lowerMsg = message.toLowerCase();

  // Check patterns
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

  return {
    isSpam: score >= 50,
    score: Math.min(score, 100),
    reasons,
  };
};
