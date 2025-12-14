import React, { useEffect, useRef, useState } from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}

const useAnimatedCounter = (value: number, duration = 800) => {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(start + (value - start) * easeOut));
      if (progress < 1) requestAnimationFrame(animate);
      else prev.current = value;
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return display;
};

const StatsCard: React.FC<StatsCardProps> = ({ icon, value, label, color }) => {
  const animatedValue = useAnimatedCounter(value);

  return (
    <div className="bg-dark-card rounded-xl p-5 border border-dark-border hover:border-twitch-purple hover:-translate-y-1 hover:shadow-lg hover:shadow-twitch-purple/10 transition-all cursor-default">
      <div 
        className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: `${color}20` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color }}>
        {typeof value === 'number' && value < 1000 
          ? animatedValue 
          : animatedValue.toLocaleString()}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
};

export default StatsCard;
