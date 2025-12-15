import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Shield, AlertTriangle, Clock, Ban, Trash2, Activity } from 'lucide-react';
import { Stats, ModerationAction } from '../types';

interface AnalyticsPageProps {
  stats: Stats;
  moderationLog: ModerationAction[];
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ stats, moderationLog }) => {
  // Calculate analytics
  const analytics = useMemo(() => {
    const autoActions = moderationLog.filter(a => a.automatic).length;
    const manualActions = moderationLog.filter(a => !a.automatic).length;
    const deleteActions = moderationLog.filter(a => a.type === 'delete').length;
    const timeoutActions = moderationLog.filter(a => a.type === 'timeout').length;
    const banActions = moderationLog.filter(a => a.type === 'ban').length;
    
    const spamRate = stats.totalMessages > 0 
      ? ((stats.spamBlocked / stats.totalMessages) * 100).toFixed(1) 
      : '0';
    
    const protectionRate = stats.totalMessages > 0
      ? (((stats.totalMessages - stats.spamBlocked) / stats.totalMessages) * 100).toFixed(1)
      : '100';

    return {
      autoActions,
      manualActions,
      deleteActions,
      timeoutActions,
      banActions,
      spamRate,
      protectionRate,
    };
  }, [stats, moderationLog]);

  // Get recent actions by hour
  const recentActivity = useMemo(() => {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    return moderationLog.filter(a => new Date(a.timestamp) > hourAgo).length;
  }, [moderationLog]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-400">View moderation statistics and insights</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BarChart3 size={20} />}
          label="Total Messages"
          value={stats.totalMessages.toLocaleString()}
          color="#9146FF"
        />
        <StatCard
          icon={<Shield size={20} />}
          label="Spam Blocked"
          value={stats.spamBlocked.toLocaleString()}
          color="#FF4D4D"
          subtext={`${analytics.spamRate}% spam rate`}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Protection Rate"
          value={`${analytics.protectionRate}%`}
          color="#00F593"
          subtext="Clean messages"
        />
        <StatCard
          icon={<Activity size={20} />}
          label="Actions (1h)"
          value={recentActivity.toString()}
          color="#FFCA28"
          subtext="Recent activity"
        />
      </div>

      {/* Action Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-yellow-400" />
            Action Breakdown
          </h3>
          <div className="space-y-4">
            <ActionBar
              icon={<Trash2 size={16} />}
              label="Deletes"
              value={analytics.deleteActions}
              total={moderationLog.length}
              color="#FF4D4D"
            />
            <ActionBar
              icon={<Clock size={16} />}
              label="Timeouts"
              value={analytics.timeoutActions}
              total={moderationLog.length}
              color="#FFCA28"
            />
            <ActionBar
              icon={<Ban size={16} />}
              label="Bans"
              value={analytics.banActions}
              total={moderationLog.length}
              color="#FF6B6B"
            />
          </div>
        </div>

        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield size={18} className="text-twitch-purple" />
            Automation Stats
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-hover rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  🤖
                </div>
                <div>
                  <div className="font-medium">Auto Actions</div>
                  <div className="text-sm text-gray-500">Automated moderation</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-400">{analytics.autoActions}</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-hover rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  👤
                </div>
                <div>
                  <div className="font-medium">Manual Actions</div>
                  <div className="text-sm text-gray-500">By moderator</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-400">{analytics.manualActions}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Moderation Log */}
      <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-border">
          <h3 className="font-semibold">Recent Moderation Actions</h3>
        </div>
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {moderationLog.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No moderation actions yet. Start monitoring to see activity.
            </div>
          ) : (
            <div className="space-y-2">
              {moderationLog.slice(0, 20).map((action) => (
                <div
                  key={action.id}
                  className="flex items-center gap-4 p-3 bg-dark-hover rounded-lg"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    action.type === 'delete' ? 'bg-red-500/20 text-red-400' :
                    action.type === 'timeout' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/30 text-red-400'
                  }`}>
                    {action.type === 'delete' ? <Trash2 size={14} /> :
                     action.type === 'timeout' ? <Clock size={14} /> :
                     <Ban size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{action.type}</span>
                      {action.automatic && (
                        <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                          AUTO
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {action.username} - {action.reason}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(action.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
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
  value: string;
  color: string;
  subtext?: string;
}> = ({ icon, label, value, color, subtext }) => (
  <div className="bg-dark-card rounded-xl p-5 border border-dark-border">
    <div className="flex items-center gap-3 mb-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <span className="text-gray-400 text-sm">{label}</span>
    </div>
    <div className="text-2xl font-bold" style={{ color }}>{value}</div>
    {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
  </div>
);

const ActionBar: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  total: number;
  color: string;
}> = ({ icon, label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm">
          <span style={{ color }}>{icon}</span>
          <span>{label}</span>
        </div>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <div className="h-2 bg-dark-hover rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
