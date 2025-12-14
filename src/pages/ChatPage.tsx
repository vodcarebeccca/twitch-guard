import React from 'react';
import { Trash2, Clock, Ban } from 'lucide-react';
import { ChatMessage, ModerationAction } from '../types';

interface ChatPageProps {
  messages: ChatMessage[];
  moderationLog: ModerationAction[];
  isMonitoring: boolean;
  onDelete: (msg: ChatMessage) => void;
  onTimeout: (msg: ChatMessage) => void;
  onBan: (msg: ChatMessage) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({
  messages,
  moderationLog,
  isMonitoring,
  onDelete,
  onTimeout,
  onBan,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Live Chat</h1>
        <p className="text-gray-400">Monitor and moderate chat in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chat Panel */}
        <div className="lg:col-span-2 bg-dark-card rounded-xl border border-dark-border overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-border flex items-center justify-between">
            <div className="font-semibold flex items-center gap-2">
              Live Chat
              {isMonitoring && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded animate-pulse-slow">
                  LIVE
                </span>
              )}
            </div>
          </div>
          
          <div className="p-4 h-[500px] overflow-y-auto space-y-2">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                {isMonitoring ? 'Waiting for messages...' : 'Start monitoring to see chat'}
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 p-3 rounded-lg group transition-colors ${
                    msg.isSpam ? 'bg-red-500/10 border-l-2 border-red-500' : 'hover:bg-dark-hover'
                  }`}
                >
                  <div 
                    className="w-9 h-9 rounded-full flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${msg.color || '#9146FF'}, #4ECDC4)` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm" style={{ color: msg.color || '#9146FF' }}>
                      {msg.displayName}
                    </div>
                    <div className="text-gray-300 text-sm break-words">{msg.message}</div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onDelete(msg)}
                      className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => onTimeout(msg)}
                      className="p-1.5 rounded bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                      title="Timeout"
                    >
                      <Clock size={14} />
                    </button>
                    <button
                      onClick={() => onBan(msg)}
                      className="p-1.5 rounded bg-red-500/30 text-red-400 hover:bg-red-500/40 transition-colors"
                      title="Ban"
                    >
                      <Ban size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Moderation Log */}
        <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-border font-semibold">
            Moderation Log
          </div>
          <div className="p-4 h-[500px] overflow-y-auto space-y-2">
            {moderationLog.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No moderation actions yet
              </div>
            ) : (
              moderationLog.map((action) => (
                <div key={action.id} className="flex items-center gap-3 p-3 bg-dark-hover rounded-lg">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                    action.type === 'delete' ? 'bg-red-500/20' :
                    action.type === 'timeout' ? 'bg-yellow-500/20' : 'bg-red-500/30'
                  }`}>
                    {action.type === 'delete' ? '🗑️' : action.type === 'timeout' ? '⏱️' : '⛔'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium capitalize">{action.type}</div>
                    <div className="text-xs text-gray-500 truncate">{action.username}</div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(action.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
