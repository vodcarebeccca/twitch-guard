import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import CallbackPage from './pages/CallbackPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { getToken, getUser, clearAuth } from './services/twitchAuth';
import { validateToken } from './services/twitchApi';
import { twitchChat } from './services/twitchChat';
import { TwitchUser, ChatMessage, ModerationAction, Stats, Settings, ConnectionStatus } from './types';
import TwitchLogo from './components/TwitchLogo';

const defaultSettings: Settings = {
  autoDelete: false,
  autoTimeout: false,
  autoBan: false,
  timeoutDuration: 300,
  spamThreshold: 50,
  customBlacklist: [],
  customWhitelist: [],
  blockAllLinks: false,
  allowedDomains: ['twitch.tv', 'clips.twitch.tv', 'twitter.com', 'x.com'],
};

const Layout: React.FC<{ user: TwitchUser; onLogout: () => void }> = ({ user, onLogout }) => (
  <div className="flex min-h-screen">
    <Sidebar user={user} onLogout={onLogout} />
    <main className="flex-1 ml-60 p-8">
      <Outlet />
    </main>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<TwitchUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [currentChannel, setCurrentChannel] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [moderationLog, setModerationLog] = useState<ModerationAction[]>([]);
  const [stats, setStats] = useState<Stats>({ totalMessages: 0, spamBlocked: 0, timeouts: 0, bans: 0 });
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const statsRef = useRef(stats);

  // Keep statsRef updated
  useEffect(() => { statsRef.current = stats; }, [stats]);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const savedUser = getUser();
      if (token && savedUser) {
        const isValid = await validateToken();
        if (isValid) {
          setUser(savedUser);
          setIsAuthenticated(true);
        } else {
          clearAuth();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Load/save settings
  useEffect(() => {
    const saved = localStorage.getItem('twitchguard_settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('twitchguard_settings', JSON.stringify(settings));
    twitchChat.setBlacklist(settings.customBlacklist);
    twitchChat.setLinkOptions(settings.blockAllLinks, settings.allowedDomains);
  }, [settings]);

  // Setup chat callbacks
  useEffect(() => {
    twitchChat.setOnMessage((msg: ChatMessage) => {
      setMessages(prev => [...prev.slice(-199), msg]);
      setStats(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 1,
        spamBlocked: prev.spamBlocked + (msg.isSpam ? 1 : 0),
      }));

      // Auto moderation
      if (msg.isSpam && settings.autoDelete) {
        const action: ModerationAction = {
          id: `action-${Date.now()}`,
          type: 'delete',
          username: msg.displayName,
          reason: msg.spamReasons.join(', ') || 'Spam detected',
          timestamp: new Date(),
          automatic: true,
        };
        setModerationLog(prev => [action, ...prev.slice(0, 99)]);
        // Send delete command
        twitchChat.sendMessage(`/delete ${msg.id}`);
      }
    });

    twitchChat.setOnStatus((status: ConnectionStatus) => {
      setConnectionStatus(status);
    });

    return () => {
      twitchChat.disconnect();
    };
  }, [settings.autoDelete]);

  const handleLogin = useCallback(() => {
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = useCallback(() => {
    twitchChat.disconnect();
    clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    setMessages([]);
    setConnectionStatus('disconnected');
  }, []);

  const startMonitoring = useCallback((channel: string) => {
    const token = getToken();
    if (!token || !user) return;
    
    setCurrentChannel(channel);
    setMessages([]);
    setStats({ totalMessages: 0, spamBlocked: 0, timeouts: 0, bans: 0 });
    twitchChat.connect(channel, token, user.login);
  }, [user]);

  const stopMonitoring = useCallback(() => {
    twitchChat.disconnect();
    setCurrentChannel('');
  }, []);

  const handleDelete = (msg: ChatMessage) => {
    twitchChat.sendMessage(`/delete ${msg.id}`);
    const action: ModerationAction = {
      id: `action-${Date.now()}`,
      type: 'delete',
      username: msg.displayName,
      reason: 'Manual delete',
      timestamp: new Date(),
      automatic: false,
    };
    setModerationLog(prev => [action, ...prev.slice(0, 99)]);
  };

  const handleTimeout = (msg: ChatMessage) => {
    twitchChat.sendMessage(`/timeout ${msg.username} ${settings.timeoutDuration}`);
    const action: ModerationAction = {
      id: `action-${Date.now()}`,
      type: 'timeout',
      username: msg.displayName,
      reason: `Timeout ${settings.timeoutDuration}s`,
      timestamp: new Date(),
      automatic: false,
    };
    setModerationLog(prev => [action, ...prev.slice(0, 99)]);
    setStats(prev => ({ ...prev, timeouts: prev.timeouts + 1 }));
  };

  const handleBan = (msg: ChatMessage) => {
    twitchChat.sendMessage(`/ban ${msg.username}`);
    const action: ModerationAction = {
      id: `action-${Date.now()}`,
      type: 'ban',
      username: msg.displayName,
      reason: 'Permanent ban',
      timestamp: new Date(),
      automatic: false,
    };
    setModerationLog(prev => [action, ...prev.slice(0, 99)]);
    setStats(prev => ({ ...prev, bans: prev.bans + 1 }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-twitch-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TwitchLogo size={32} className="text-white animate-pulse" />
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const isMonitoring = connectionStatus === 'connected' || connectionStatus === 'connecting';

  return (
    <Routes>
      <Route path="/callback" element={<CallbackPage onLogin={handleLogin} />} />
      
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : user ? (
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={
            <DashboardPage
              user={user}
              stats={stats}
              isMonitoring={isMonitoring}
              connectionStatus={connectionStatus}
              currentChannel={currentChannel}
              onStartMonitoring={startMonitoring}
              onStopMonitoring={stopMonitoring}
            />
          } />
          <Route path="/chat" element={
            <ChatPage
              messages={messages}
              moderationLog={moderationLog}
              isMonitoring={isMonitoring}
              connectionStatus={connectionStatus}
              currentChannel={currentChannel}
              onDelete={handleDelete}
              onTimeout={handleTimeout}
              onBan={handleBan}
            />
          } />
          <Route path="/moderation" element={
            <ChatPage
              messages={messages.filter(m => m.isSpam)}
              moderationLog={moderationLog}
              isMonitoring={isMonitoring}
              connectionStatus={connectionStatus}
              currentChannel={currentChannel}
              onDelete={handleDelete}
              onTimeout={handleTimeout}
              onBan={handleBan}
            />
          } />
          <Route path="/analytics" element={
            <AnalyticsPage stats={stats} moderationLog={moderationLog} />
          } />
          <Route path="/settings" element={
            <SettingsPage settings={settings} setSettings={setSettings} />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

export default App;
