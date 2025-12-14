import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseCallback, saveToken, saveUser } from '../services/twitchAuth';
import { getCurrentUser } from '../services/twitchApi';
import TwitchLogo from '../components/TwitchLogo';

interface CallbackPageProps {
  onLogin: () => void;
}

const CallbackPage: React.FC<CallbackPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const token = parseCallback();
      
      if (token) {
        saveToken(token);
        const user = await getCurrentUser();
        
        if (user) {
          saveUser(user);
          onLogin();
          navigate('/');
        } else {
          navigate('/login?error=user_fetch_failed');
        }
      } else {
        navigate('/login?error=no_token');
      }
    };

    handleCallback();
  }, [navigate, onLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-twitch-purple rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <TwitchLogo size={32} className="text-white" />
        </div>
        <p className="text-gray-400">Connecting to Twitch...</p>
        <div className="mt-4 flex justify-center gap-1">
          <span className="w-2 h-2 bg-twitch-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-twitch-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-twitch-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default CallbackPage;
