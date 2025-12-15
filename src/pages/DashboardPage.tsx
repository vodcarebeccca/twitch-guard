import React, { useState } from 'react';
import { MessageSquare, ShieldOff, Clock, CheckCircle, Play, Square, Wifi, WifiOff, Loader2 } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { Stats, TwitchUser, ConnectionStatus } from '../types';

interface DashboardPageProps {
  user: TwitchUser;
  stats: Stats;
  isMonitoring: boolean;
  connectionStatus: ConnectionStatus;
  currentChannel: string;
  onStartMonitoring: (channel: string) => void;
  onStopMonitoring: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  stats,
  isMonitoring,
  connectionStatus,
  currentChannel,
  onStartMonitoring,
  onStopMonitoring,
}) => {
  const [channel, setChannel] = useState(user.login);

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'connected':
        return { icon: <Wifi size={16} />, text: `Connected to #${currentChannel}`, color: 'text-green-400', bg: 'bg-green-400' };
      case 'connecting':
        return { icon: <Loader2 size={16} className="animate-spin" />, text: 'Connecting...', color: 'text-yellow-400', bg: 'bg-yellow-400' };
      case 'error':
        return { icon: <WifiOff size={16} />, text: 'Connection error', color: 'text-red-400', bg: 'bg-red-400' };
      default:
        return { icon: <WifiOff size={16} />, text: 'Disconnected', color: 'text-gray-400', bg: 'bg-gray-400' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Monitor your chat moderation in real-time</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-card border border-dark-border ${statusInfo.color}`}>
          {statusInfo.icon}
          <span className="text-sm">{statusInfo.text}</span>
        </div>
      </div>

      {/* Channel Input */}
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          🔗 Connect to Channel
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            placeholder="Enter Twitch channel name"
            disabled={isMonitoring}
            className="flex-1 px-4 py-3 bg-dark-hover border-2 border-dark-border rounded-lg text-white outline-none focus:border-twitch-purple transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => isMonitoring ? onStopMonitoring() : onStartMonitoring(channel)}
            disabled={connectionStatus === 'connecting'}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50 ${
              isMonitoring
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-twitch-purple hover:bg-twitch-purple-dark text-white'
            }`}
          >
            {connectionStatus === 'connecting' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isMonitoring ? (
              <Square size={18} />
            ) : (
              <Play size={18} fill="white" />
            )}
            {connectionStatus === 'connecting' ? 'Connecting...' : isMonitoring ? 'Stop' : 'Start Monitoring'}
          </button>
        </div>
        {connectionStatus === 'connected' && (
          <div className="mt-3 text-sm text-green-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow" />
            Live monitoring #{currentChannel}
          </div>
        )}
        {connectionStatus === 'error' && (
          <div className="mt-3 text-sm text-red-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full" />
            Connection failed. Check your token or try again.
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<MessageSquare size={20} />}
          value={stats.totalMessages}
          label="Total Messages"
          color="#9146FF"
        />
        <StatsCard
          icon={<ShieldOff size={20} />}
          value={stats.spamBlocked}
          label="Spam Blocked"
          color="#FF4D4D"
        />
        <StatsCard
          icon={<Clock size={20} />}
          value={stats.timeouts}
          label="Timeouts"
          color="#FFCA28"
        />
        <StatsCard
          icon={<CheckCircle size={20} />}
          value={stats.bans}
          label="Bans"
          color="#00F593"
        />
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-dark-card rounded-xl p-5 border border-dark-border">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            🚀 Getting Started
          </h3>
          <ol className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-twitch-purple font-bold">1.</span>
              Enter your Twitch channel name above
            </li>
            <li className="flex gap-2">
              <span className="text-twitch-purple font-bold">2.</span>
              Click Start Monitoring to connect
            </li>
            <li className="flex gap-2">
              <span className="text-twitch-purple font-bold">3.</span>
              Spam will be detected automatically
            </li>
            <li className="flex gap-2">
              <span className="text-twitch-purple font-bold">4.</span>
              Enable Auto-Delete in Settings for automatic moderation
            </li>
          </ol>
        </div>

        <div className="bg-dark-card rounded-xl p-5 border border-dark-border">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            🕐 Recent Activity
          </h3>
          {stats.spamBlocked > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">🗑️</span>
                <div className="flex-1">
                  <p>Spam deleted</p>
                  <p className="text-gray-500">Just now</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No activity yet. Start monitoring to see activity.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
