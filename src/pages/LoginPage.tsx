import React from 'react';
import TwitchLogo from '../components/TwitchLogo';
import { getAuthUrl } from '../services/twitchAuth';
import { Zap, Shield, BarChart3, Bot } from 'lucide-react';

const features = [
  { icon: Bot, text: 'AI spam detection with 99% accuracy' },
  { icon: Zap, text: 'Real-time chat monitoring via WebSocket' },
  { icon: Shield, text: 'Auto-delete, timeout, and ban spammers' },
  { icon: BarChart3, text: 'Detailed analytics and moderation logs' },
];

const LoginPage: React.FC = () => {
  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute w-[600px] h-[600px] bg-twitch-purple/15 rounded-full blur-3xl -top-48 -right-48" />
      <div className="absolute w-[400px] h-[400px] bg-green-500/10 rounded-full blur-3xl -bottom-24 -left-24" />

      <div className="bg-dark-card rounded-2xl p-12 w-full max-w-md border border-dark-border relative z-10 text-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-twitch-purple to-twitch-purple-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-twitch-purple/30">
          <TwitchLogo size={48} className="text-white" />
        </div>

        <h1 className="text-3xl font-bold mb-2">TwitchGuard</h1>
        <p className="text-gray-400 mb-8">AI-Powered Chat Moderation for Twitch Streamers</p>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-4 bg-twitch-purple hover:bg-twitch-purple-dark text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-twitch-purple/40"
        >
          <TwitchLogo size={24} />
          Login with Twitch
        </button>

        {/* Features */}
        <div className="mt-10 text-left">
          {features.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-dark-border last:border-0">
              <div className="w-9 h-9 bg-twitch-purple/15 rounded-lg flex items-center justify-center">
                <Icon size={18} className="text-twitch-purple-light" />
              </div>
              <span className="text-gray-400 text-sm">{text}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-dark-border text-gray-500 text-xs">
          By logging in, you agree to our{' '}
          <a href="#" className="text-twitch-purple-light hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-twitch-purple-light hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
