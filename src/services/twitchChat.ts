/**
 * Twitch Chat Service - Real IRC connection via WebSocket
 */
import { ChatMessage } from '../types';
import { detectSpam } from './spamDetection';

type MessageCallback = (message: ChatMessage) => void;
type StatusCallback = (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

class TwitchChatService {
  private ws: WebSocket | null = null;
  private channel: string = '';
  private token: string = '';
  private username: string = '';
  private onMessage: MessageCallback | null = null;
  private onStatus: StatusCallback | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private customBlacklist: string[] = [];
  private blockAllLinks: boolean = false;
  private allowedDomains: string[] = [];

  connect(channel: string, token: string, username: string) {
    this.channel = channel.toLowerCase().replace('#', '');
    this.token = token;
    this.username = username.toLowerCase();
    this.reconnectAttempts = 0;
    this.doConnect();
  }

  private doConnect() {
    if (this.ws) {
      this.ws.close();
    }

    this.onStatus?.('connecting');
    this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

    this.ws.onopen = () => {
      if (!this.ws) return;
      // Authenticate
      this.ws.send(`PASS oauth:${this.token}`);
      this.ws.send(`NICK ${this.username}`);
      // Request tags for user info
      this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
      // Join channel
      this.ws.send(`JOIN #${this.channel}`);
    };

    this.ws.onmessage = (event) => {
      const lines = event.data.split('\r\n');
      for (const line of lines) {
        this.handleMessage(line);
      }
    };

    this.ws.onclose = () => {
      this.onStatus?.('disconnected');
      // Auto reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.doConnect(), 3000);
      }
    };

    this.ws.onerror = () => {
      this.onStatus?.('error');
    };
  }

  private handleMessage(raw: string) {
    if (!raw) return;

    // Respond to PING
    if (raw.startsWith('PING')) {
      this.ws?.send('PONG :tmi.twitch.tv');
      return;
    }

    // Check for successful join
    if (raw.includes('366') || raw.includes('JOIN')) {
      this.onStatus?.('connected');
    }

    // Parse PRIVMSG (chat messages)
    if (raw.includes('PRIVMSG')) {
      const parsed = this.parseMessage(raw);
      if (parsed && this.onMessage) {
        // Run spam detection with link options
        const spamResult = detectSpam(parsed.message, {
          customBlacklist: this.customBlacklist,
          blockAllLinks: this.blockAllLinks,
          allowedDomains: this.allowedDomains,
        });
        parsed.isSpam = spamResult.isSpam;
        parsed.spamScore = spamResult.score;
        parsed.spamReasons = spamResult.reasons;
        this.onMessage(parsed);
      }
    }
  }

  private parseMessage(raw: string): ChatMessage | null {
    try {
      // Parse IRC tags
      const tagMatch = raw.match(/^@([^ ]+)/);
      const tags: Record<string, string> = {};
      if (tagMatch) {
        tagMatch[1].split(';').forEach(tag => {
          const [key, value] = tag.split('=');
          tags[key] = value || '';
        });
      }

      // Parse message content
      const msgMatch = raw.match(/PRIVMSG #\w+ :(.+)$/);
      const message = msgMatch ? msgMatch[1] : '';

      // Parse username
      const userMatch = raw.match(/:(\w+)!\w+@\w+\.tmi\.twitch\.tv/);
      const username = userMatch ? userMatch[1] : 'unknown';

      return {
        id: tags['id'] || `msg-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        oderId: tags['user-id'] || '',
        username: username,
        displayName: tags['display-name'] || username,
        message: message,
        color: tags['color'] || this.getRandomColor(),
        badges: this.parseBadges(tags['badges'] || ''),
        timestamp: new Date(),
        isSpam: false,
        spamScore: 0,
        spamReasons: [],
      };
    } catch {
      return null;
    }
  }

  private parseBadges(badgeStr: string): Record<string, string> {
    const badges: Record<string, string> = {};
    if (!badgeStr) return badges;
    badgeStr.split(',').forEach(badge => {
      const [name, version] = badge.split('/');
      if (name) badges[name] = version || '1';
    });
    return badges;
  }

  private getRandomColor(): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#9146FF', '#FFE66D', '#95E1D3', '#F38181'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  setBlacklist(words: string[]) {
    this.customBlacklist = words;
  }

  setLinkOptions(blockAllLinks: boolean, allowedDomains: string[]) {
    this.blockAllLinks = blockAllLinks;
    this.allowedDomains = allowedDomains;
  }

  setOnMessage(callback: MessageCallback) {
    this.onMessage = callback;
  }

  setOnStatus(callback: StatusCallback) {
    this.onStatus = callback;
  }

  sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(`PRIVMSG #${this.channel} :${message}`);
    }
  }

  disconnect() {
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnect
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.onStatus?.('disconnected');
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const twitchChat = new TwitchChatService();
export default twitchChat;
