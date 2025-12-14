import React from 'react';
import { Settings } from '../types';

interface SettingsPageProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`w-12 h-6 rounded-full relative transition-colors ${
      enabled ? 'bg-twitch-purple' : 'bg-gray-600'
    }`}
  >
    <span
      className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-0.5'
      }`}
    />
  </button>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, setSettings }) => {
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400">Configure your moderation preferences</p>
      </div>

      {/* Auto Actions */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <h2 className="font-semibold mb-4">Auto Actions</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-hover rounded-lg">
            <div>
              <div className="font-medium">Auto-Delete Spam</div>
              <div className="text-sm text-gray-500">Automatically delete detected spam messages</div>
            </div>
            <Toggle
              enabled={settings.autoDelete}
              onChange={() => updateSetting('autoDelete', !settings.autoDelete)}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-dark-hover rounded-lg">
            <div>
              <div className="font-medium">Auto-Timeout</div>
              <div className="text-sm text-gray-500">Timeout users who send spam</div>
            </div>
            <Toggle
              enabled={settings.autoTimeout}
              onChange={() => updateSetting('autoTimeout', !settings.autoTimeout)}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-dark-hover rounded-lg">
            <div>
              <div className="font-medium">Auto-Ban</div>
              <div className="text-sm text-gray-500">Ban repeat offenders automatically</div>
            </div>
            <Toggle
              enabled={settings.autoBan}
              onChange={() => updateSetting('autoBan', !settings.autoBan)}
            />
          </div>
        </div>
      </div>

      {/* Detection Settings */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <h2 className="font-semibold mb-4">Detection Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Spam Threshold ({settings.spamThreshold}%)</label>
            <input
              type="range"
              min="30"
              max="90"
              value={settings.spamThreshold}
              onChange={(e) => updateSetting('spamThreshold', Number(e.target.value))}
              className="w-full accent-twitch-purple"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Sensitive (30%)</span>
              <span>Strict (90%)</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Timeout Duration</label>
            <select
              value={settings.timeoutDuration}
              onChange={(e) => updateSetting('timeoutDuration', Number(e.target.value))}
              className="w-full px-4 py-3 bg-dark-hover border border-dark-border rounded-lg text-white outline-none focus:border-twitch-purple"
            >
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
              <option value={600}>10 minutes</option>
              <option value={3600}>1 hour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom Lists */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <h2 className="font-semibold mb-4">Custom Blacklist</h2>
        <textarea
          value={settings.customBlacklist.join('\n')}
          onChange={(e) => updateSetting('customBlacklist', e.target.value.split('\n').filter(Boolean))}
          placeholder="Enter words to block (one per line)"
          className="w-full h-32 px-4 py-3 bg-dark-hover border border-dark-border rounded-lg text-white outline-none focus:border-twitch-purple resize-none"
        />
        <p className="text-xs text-gray-500 mt-2">Messages containing these words will be flagged as spam</p>
      </div>
    </div>
  );
};

export default SettingsPage;
