export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  email?: string;
}

export interface ChatMessage {
  id: string;
  oderId?: string;
  userId?: string;
  username: string;
  displayName: string;
  message: string;
  color: string;
  badges: Record<string, string>;
  timestamp: Date;
  isSpam: boolean;
  spamScore: number;
  spamReasons: string[];
  deleted?: boolean;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface ModerationAction {
  id: string;
  type: 'delete' | 'timeout' | 'ban';
  username: string;
  reason: string;
  timestamp: Date;
  automatic: boolean;
}

export interface Stats {
  totalMessages: number;
  spamBlocked: number;
  timeouts: number;
  bans: number;
}

export interface Settings {
  autoDelete: boolean;
  autoTimeout: boolean;
  autoBan: boolean;
  timeoutDuration: number;
  spamThreshold: number;
  customBlacklist: string[];
  customWhitelist: string[];
}
