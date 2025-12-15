import React, { useState } from 'react';
import { 
  Ban, Type, Link2, Star, RotateCcw, MessageSquare, 
  Settings, Save, Shield, Zap, Globe, Hash
} from 'lucide-react';
import { Settings as SettingsType } from '../types';

interface ModerationPageProps {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
}

interface FilterCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  onSettings?: () => void;
  children?: React.ReactNode;
}

const FilterCard: React.FC<FilterCardProps> = ({
  icon, title, description, enabled, onToggle, onSettings, children
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-lg transition-all duration-300 ${
          isAnimating ? 'scale-110' : 'scale-100'
        } ${enabled ? 'bg-twitch-purple/10 text-twitch-purple' : 'bg-gray-100 dark:bg-dark-hover text-gray-400'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      
      {children && <div className="mt-4 pl-14">{children}</div>}
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
        <button
          onClick={handleToggle}
          className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
            enabled ? 'bg-twitch-purple' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
            enabled ? 'left-6' : 'left-0.5'
          }`} />
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${enabled ? 'text-twitch-purple' : 'text-gray-400'}`}>
            {enabled ? 'Enabled' : 'Disabled'}
          </span>
          {onSettings && (
            <>
              <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-400 hover:text-gray-600 transition-colors">
                <Save size={16} />
              </button>
              <button 
                onClick={onSettings}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Settings size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ModerationPage: React.FC<ModerationPageProps> = ({ settings, setSettings }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Moderation</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage chat restrictions and spam filters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Blacklist Words/Phrases */}
        <FilterCard
          icon={<Ban size={20} />}
          title="Blacklist Words/Phrases"
          description="This filter allows you to timeout custom words, phrases, and patterns."
          enabled={settings.customBlacklist.length > 0}
          onToggle={() => setActiveModal('blacklist')}
          onSettings={() => setActiveModal('blacklist')}
        />

        {/* Excess Caps */}
        <FilterCard
          icon={<Type size={20} />}
          title="Excess Caps"
          description="This filter allows you to timeout users who use excessive capital letters."
          enabled={true}
          onToggle={() => {}}
          onSettings={() => setActiveModal('caps')}
        />

        {/* Excess Emotes */}
        <FilterCard
          icon={<Zap size={20} />}
          title="Excess Emotes"
          description="This filter allows you to timeout users abusing emotes."
          enabled={true}
          onToggle={() => {}}
          onSettings={() => setActiveModal('emotes')}
        />

        {/* Links */}
        <FilterCard
          icon={<Link2 size={20} />}
          title="Links"
          description="This filter allows you to timeout and whitelist links."
          enabled={settings.blockAllLinks}
          onToggle={() => updateSetting('blockAllLinks', !settings.blockAllLinks)}
          onSettings={() => setActiveModal('links')}
        />

        {/* Excess Symbols */}
        <FilterCard
          icon={<Star size={20} />}
          title="Excess Symbols"
          description="This filter allows you to timeout users spamming excessive symbols."
          enabled={true}
          onToggle={() => {}}
          onSettings={() => setActiveModal('symbols')}
        />

        {/* Repetitions */}
        <FilterCard
          icon={<RotateCcw size={20} />}
          title="Repetitions"
          description="This filter allows you to timeout users who repeat words or phrases."
          enabled={true}
          onToggle={() => {}}
          onSettings={() => setActiveModal('repetitions')}
        />

        {/* Crypto Scam */}
        <FilterCard
          icon={<Shield size={20} />}
          title="Crypto Scam Protection"
          description="Detect and block crypto scams, fake giveaways, and phishing."
          enabled={true}
          onToggle={() => {}}
          onSettings={() => setActiveModal('crypto')}
        />

        {/* Unicode/Homoglyph */}
        <FilterCard
          icon={<Globe size={20} />}
          title="Unicode Protection"
          description="Detect suspicious unicode characters used to bypass filters."
          enabled={true}
          onToggle={() => {}}
          onSettings={() => setActiveModal('unicode')}
        />

        {/* Shared Chat */}
        <FilterCard
          icon={<MessageSquare size={20} />}
          title="Auto Moderation"
          description="Automatically delete, timeout, or ban detected spam messages."
          enabled={settings.autoDelete}
          onToggle={() => updateSetting('autoDelete', !settings.autoDelete)}
          onSettings={() => setActiveModal('auto')}
        />
      </div>

      {/* Blacklist Modal */}
      {activeModal === 'blacklist' && (
        <Modal title="Blacklist Words/Phrases" onClose={() => setActiveModal(null)}>
          <textarea
            value={settings.customBlacklist.join('\n')}
            onChange={(e) => updateSetting('customBlacklist', e.target.value.split('\n').filter(Boolean))}
            placeholder="Enter words to block (one per line)"
            className="w-full h-48 px-4 py-3 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-gray-900 dark:text-white outline-none focus:border-twitch-purple resize-none"
          />
          <p className="text-sm text-gray-500 mt-2">Messages containing these words will be flagged as spam</p>
        </Modal>
      )}

      {/* Links Modal */}
      {activeModal === 'links' && (
        <Modal title="Link Protection Settings" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.blockAllLinks}
                onChange={(e) => updateSetting('blockAllLinks', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-twitch-purple focus:ring-twitch-purple"
              />
              <span>Block all links except allowed domains</span>
            </label>
            <div>
              <label className="block text-sm font-medium mb-2">Allowed Domains</label>
              <textarea
                value={settings.allowedDomains.join('\n')}
                onChange={(e) => updateSetting('allowedDomains', e.target.value.split('\n').filter(Boolean))}
                placeholder="twitch.tv&#10;clips.twitch.tv"
                className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg outline-none focus:border-twitch-purple resize-none font-mono text-sm"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Auto Moderation Modal */}
      {activeModal === 'auto' && (
        <Modal title="Auto Moderation Settings" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-hover rounded-lg">
              <span>Auto-Delete Spam</span>
              <input
                type="checkbox"
                checked={settings.autoDelete}
                onChange={(e) => updateSetting('autoDelete', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-twitch-purple focus:ring-twitch-purple"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-hover rounded-lg">
              <span>Auto-Timeout Spammers</span>
              <input
                type="checkbox"
                checked={settings.autoTimeout}
                onChange={(e) => updateSetting('autoTimeout', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-twitch-purple focus:ring-twitch-purple"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-hover rounded-lg">
              <span>Auto-Ban Repeat Offenders</span>
              <input
                type="checkbox"
                checked={settings.autoBan}
                onChange={(e) => updateSetting('autoBan', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-twitch-purple focus:ring-twitch-purple"
              />
            </label>
            <div>
              <label className="block text-sm font-medium mb-2">Timeout Duration</label>
              <select
                value={settings.timeoutDuration}
                onChange={(e) => updateSetting('timeoutDuration', Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg outline-none focus:border-twitch-purple"
              >
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
                <option value={600}>10 minutes</option>
                <option value={3600}>1 hour</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Modal Component
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ 
  title, onClose, children 
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
    <div 
      className="bg-white dark:bg-dark-card rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl animate-in fade-in zoom-in duration-200"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-hover rounded">✕</button>
      </div>
      {children}
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors">
          Cancel
        </button>
        <button onClick={onClose} className="px-4 py-2 bg-twitch-purple text-white rounded-lg hover:bg-twitch-purple-dark transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

export default ModerationPage;