import React, { useEffect } from 'react';
import { 
  MessageSquare, ShieldOff, Clock, Ban, 
  Wifi, WifiOff, Loader2, Activity, Users, Eye
} from 'lucide-react';
import { Stats, TwitchUser, ConnectionStatus } from '../types';

interface DashboardPageProps {
  user: TwitchUser;
  stats: Stats;
  connectionStatus: ConnectionStatus;
  currentChannel: string;
  onConnect: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  stats,
  connectionStatus,
  currentChannel,
  onConnect,
}) => {
  // Auto-connect on mount
  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      onConnect();
    }
  }, []);

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full">
            <Wifi size={16} />
            <span className="text-sm font-medium">Connected to #{currentChannel}</span>
          </div>
        );
      case 'connecting':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-full">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm font-medium">Connecting...</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-full">
            <WifiOff size={16} />
            <span className="text-sm font-medium">Connection Error</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-500/10 text-gray-500 rounded-full">
            <WifiOff size={16} />
            <span className="text-sm font-medium">Disconnected</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, {user.display_name}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<MessageSquare size={20} />}
          label="Total Messages"
          value={stats.totalMessages}
          color="purple"
        />
        <StatCard
          icon={<ShieldOff size={20} />}
          label="Spam Blocked"
          value={stats.spamBlocked}
          color="red"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Timeouts"
          value={stats.timeouts}
          color="yellow"
        />
        <StatCard
          icon={<Ban size={20} />}
          label="Bans"
          value={stats.bans}
          color="green"
        />
      </div>

      {/* Channel Info Card */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
        <div className="flex items-center gap-4">
          <img 
            src={user.profile_image_url} 
            alt={user.display_name}
            className="w-16 h-16 rounded-full"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.display_name}</h2>
            <p className="text-gray-500">@{user.login}</p>
          </div>
          {connectionStatus === 'disconnected' && (
            <button
              onClick={onConnect}
              className="px-4 py-2 bg-twitch-purple text-white rounded-lg hover:bg-twitch-purple-dark transition-colors flex items-center gap-2"
            >
              <Wifi size={18} />
              Connect
            </button>
          )}
        </div>

        {connectionStatus === 'connected' && (
          <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 dark:border-dark-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                <Activity size={16} />
                <span className="text-sm">Status</span>
              </div>
              <p className="font-semibold text-green-500">Live Monitoring</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                <Eye size={16} />
                <span className="text-sm">Channel</span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">#{currentChannel}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                <Users size={16} />
                <span className="text-sm">Protection</span>
              </div>
              <p className="font-semibold text-twitch-purple">Active</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Protection Summary</h3>
          <div className="space-y-3">
            <ProgressBar label="Spam Detection" value={100} color="purple" />
            <ProgressBar label="Link Protection" value={100} color="blue" />
            <ProgressBar label="Crypto Scam Filter" value={100} color="green" />
            <ProgressBar label="Unicode Protection" value={100} color="yellow" />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          {stats.spamBlocked > 0 ? (
            <div className="space-y-3">
              <ActivityItem icon="🛡️" text="Spam protection active" time="Now" />
              <ActivityItem icon="🔗" text="Link filter enabled" time="Now" />
              <ActivityItem icon="🚫" text={`${stats.spamBlocked} spam messages blocked`} time="Session" />
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No activity yet. Monitoring your chat...</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'purple' | 'red' | 'yellow' | 'green';
}> = ({ icon, label, value, color }) => {
  const colors = {
    purple: 'bg-purple-500/10 text-purple-500',
    red: 'bg-red-500/10 text-red-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    green: 'bg-green-500/10 text-green-500',
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]} mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
};

const ProgressBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const colors: Record<string, string> = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-gray-900 dark:text-white font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-dark-hover rounded-full overflow-hidden">
        <div className={`h-full ${colors[color]} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{ icon: string; text: string; time: string }> = ({ icon, text, time }) => (
  <div className="flex items-center gap-3">
    <span className="text-lg">{icon}</span>
    <div className="flex-1">
      <p className="text-sm text-gray-900 dark:text-white">{text}</p>
    </div>
    <span className="text-xs text-gray-400">{time}</span>
  </div>
);

export default DashboardPage;