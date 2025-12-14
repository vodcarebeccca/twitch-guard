import { TWITCH_CONFIG } from '../constants';
import { TwitchUser } from '../types';

const TOKEN_KEY = 'twitch_access_token';
const USER_KEY = 'twitch_user';

export const getAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: TWITCH_CONFIG.clientId,
    redirect_uri: TWITCH_CONFIG.redirectUri,
    response_type: 'token',
    scope: TWITCH_CONFIG.scopes,
  });
  return `https://id.twitch.tv/oauth2/authorize?${params}`;
};

export const parseCallback = (): string | null => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get('access_token');
};

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const saveUser = (user: TwitchUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): TwitchUser | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};
