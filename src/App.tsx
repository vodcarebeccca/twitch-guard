import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import CallbackPage from './pages/CallbackPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import { getToken, getUser, clearAuth } from './services/twitchAuth';
import { validateToken } from './services/twitchApi';
import { detectSpam } from './services/spamDetection';
import { TwitchUser, ChatMessage, ModerationAction, Stats, Settings } from './types';
import TwitchLogo from './components/TwitchLogo';

const defaultSettings: Settings = {
  autoDelete: false,
  autoTimeout: false,
  autoBan: false,
  timeoutDuration: 300,
  spamThreshold: 50,
  customBlacklist: [],
  customWhitelist: [],
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
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [moderationLog, setModerationLog] = useState<ModerationAction[]>([]);
  const [stats, setStats] = useState<Stats>({ totalMessages: 0, spamBlocked: 0, timeouts: 0, bans: 0 });
  const [settings, setSettings] = useState<Settings>(defaultSettings);

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

  // Load settings
  useEffect(() => {
    const saved = localStorage.getItem('twitchguard_settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem('twitchguard_settings', JSON.stringify(settings));
  }, [settings]);

  const handleLogin = useCallback(() => {
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = useCallback(() => {
    clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    setIsMonitoring(false);
    setMessages([]);
  }, []);

  // Simulated chat monitoring (replace with tmi.js in production)
  const startMonitoring = useCallback((_channel: string) => {
    setIsMonitoring(true);
    setMessages([]);
    setStats({ totalMessages: 0, spamBlocked: 0, timeouts: 0, bans: 0 });

    // Demo: simulate incoming messages
    const demoMessages = [
      { user: 'CoolGamer', msg: 'This stream is amazing! PogChamp', color: '#FF6B6B' },
      { user: 'SpamBot99', msg: '🔥 FREE FOLLOWERS! Visit bit.ly/scam123 🔥', color: '#888' },
      { user: 'VIPViewer', msg: 'Just subscribed! Love your content ❤️', color: '#9146FF' },
      { user: 'NightOwl', msg: 'What game are you playing next?', color: '#4ECDC4' },
      { user: 'LinkSpammer', msg: 'Check my bio for FREE VIEWERS!!!', color: '#666' },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i >= demoMessages.length) {
        i = 0;
      }
      const demo = demoMessages[i];
      const spamResult = detectSpam(demo.msg, settings.customBlacklist);
      
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        userId: `user-${i}`,
        username: demo.user.toLowerCase(),
        displayName: demo.user,
        message: demo.msg,
        color: demo.color,
        badges: {},
        timestamp: new Date(),
        isSpam: spamResult.isSpam,
        spamScore: spamResult.score,
        spamReasons: spamResult.reasons,
      };

      setMessages(prev => [...prev.slice(-99), newMsg]);
      setStats(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 1,
        spamBlocked: prev.spamBlocked + (spamResult.isSpam ? 1 : 0),
      }));

      // Auto actions
      if (spamResult.isSpam && settings.autoDelete) {
        const action: ModerationAction = {
          id: `action-${Date.now()}`,
          type: 'delete',
          username: demo.user,
          reason: spamResult.reasons.join(', '),
          timestamp: new Date(),
          automatic: true,
        };
        setModerationLog(prev => [action, ...prev.slice(0, 49)]);
      }

      i++;
    }, 2000);

    return () => clearInterval(interval);
  }, [settings]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  const handleDelete = (msg: ChatMessage) => {
    const action: ModerationAction = {
      id: `action-${Date.now()}`,
      type: 'delete',
      username: msg.displayName,
      reason: 'Manual delete',
      timestamp: new Date(),
      automatic: false,
    };
    setModerationLog(prev => [action, ...prev.slice(0, 49)]);
  };

  const handleTimeout = (msg: ChatMessage) => {
    const action: ModerationAction = {
      id: `action-${Date.now()}`,
      type: 'timeout',
      username: msg.displayName,
      reason: 'Manual timeout',
      timestamp: new Date(),
      automatic: false,
    };
    setModerationLog(prev => [action, ...prev.slice(0, 49)]);
    setStats(prev => ({ ...prev, timeouts: prev.timeouts + 1 }));
  };

  const handleBan = (msg: ChatMessage) => {
    const action: ModerationAction = {
      id: `action-${Date.now()}`,
      type: 'ban',
      username: msg.displayName,
      reason: 'Manual ban',
      timestamp: new Date(),
      automatic: false,
    };
    setModerationLog(prev => [action, ...prev.slice(0, 49)]);
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
              onStartMonitoring={startMonitoring}
              onStopMonitoring={stopMonitoring}
            />
          } />
          <Route path="/chat" element={
            <ChatPage
              messages={messages}
              moderationLog={moderationLog}
              isMonitoring={isMonitoring}
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
              onDelete={handleDelete}
              onTimeout={handleTimeout}
              onBan={handleBan}
            />
          } />
          <Route path="/analytics" element={
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-gray-400">Coming soon...</p>
            </div>
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
