import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Shield, BarChart3, Settings, LogOut } from 'lucide-react';
import TwitchLogo from './TwitchLogo';
import { TwitchUser } from '../types';

interface SidebarProps {
  user: TwitchUser;
  onLogout: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/chat', icon: MessageSquare, label: 'Live Chat' },
  { to: '/moderation', icon: Shield, label: 'Moderation' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
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

      {/* User Profile */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center gap-3">
          <img 
            src={user.profile_image_url} 
            alt={user.display_name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{user.display_name}</div>
            <div className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow" />
              Connected
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
