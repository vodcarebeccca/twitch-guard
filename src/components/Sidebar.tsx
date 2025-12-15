import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Shield, BarChart3, LogOut, ExternalLink } from 'lucide-react';
import TwitchLogo from './TwitchLogo';
import { TwitchUser } from '../types';

interface SidebarProps {
  user: TwitchUser;
  onLogout: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/moderation', icon: Shield, label: 'Chat Moderation' },
  { to: '/chat', icon: MessageSquare, label: 'Logs' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  return (
    <aside className="w-60 bg-dark-card border-r border-dark-border flex flex-col h-screen fixed">
      {/* Logo */}
      <div className="p-5 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-twitch-purple to-twitch-purple-dark rounded-xl flex items-center justify-center">
            <TwitchLogo size={24} className="text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-twitch-purple-light to-twitch-purple bg-clip-text text-transparent">
            TwitchGuard
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                isActive
                  ? 'bg-twitch-purple/20 text-twitch-purple-light'
                  : 'text-gray-400 hover:bg-dark-hover hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* External Links */}
      <div className="px-3 pb-2">
        <a 
          href="https://github.com/vodcarebeccca/twitch-guard" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-hover hover:text-white transition-all"
        >
          <ExternalLink size={20} />
          Documentation
        </a>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center gap-3">
          <img 
            src={user.profile_image_url} 
            alt={user.display_name}
            className="w-10 h-10 rounded-full ring-2 ring-twitch-purple/30"
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{user.display_name}</div>
            <button
              onClick={onLogout}
              className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <LogOut size={12} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
