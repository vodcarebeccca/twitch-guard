import { TWITCH_CONFIG } from '../constants';
import { TwitchUser } from '../types';
import { getToken } from './twitchAuth';

const API_BASE = 'https://api.twitch.tv/helix';

const getHeaders = () => ({
  'Authorization': `Bearer ${getToken()}`,
  'Client-Id': TWITCH_CONFIG.clientId,
  'Content-Type': 'application/json',
});

export const validateToken = async (): Promise<boolean> => {
  try {
    const res = await fetch('https://id.twitch.tv/oauth2/validate', {
      headers: { 'Authorization': `OAuth ${getToken()}` },
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const getCurrentUser = async (): Promise<TwitchUser | null> => {
  try {
    const res = await fetch(`${API_BASE}/users`, { headers: getHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data[0] || null;
  } catch {
    return null;
  }
};

export const deleteMessage = async (
  broadcasterId: string,
  moderatorId: string,
  messageId: string
): Promise<boolean> => {
  try {
    const params = new URLSearchParams({
      broadcaster_id: broadcasterId,
      moderator_id: moderatorId,
      message_id: messageId,
    });
    const res = await fetch(`${API_BASE}/moderation/chat?${params}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
};
