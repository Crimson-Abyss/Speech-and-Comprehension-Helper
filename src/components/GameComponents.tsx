import React, { useMemo } from 'react';

interface GameCardProps {
  title: string;
  description: string;
  emoji: string;
  gradient: string;
  onClick: () => void;
  stars?: number;
  gamesPlayed?: number;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  emoji,
  gradient,
  onClick,
  stars = 0,
  gamesPlayed = 0,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-full p-6 rounded-3xl ${gradient} card-hover btn-press text-white text-left overflow-hidden group`}
    >
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
      
      <div className="relative z-10">
        <div className="text-6xl mb-4 animate-bounce-slow group-hover:animate-wiggle">
          {emoji}
        </div>
        <h3 className="text-2xl font-bold mb-2 text-shadow">
          {title}
        </h3>
        <p className="text-white/80 text-sm mb-4">
          {description}
        </p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span className="font-semibold">{stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🎮</span>
            <span className="font-semibold">{gamesPlayed} played</span>
          </div>
        </div>
      </div>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
        <span className="text-2xl">▶</span>
      </div>
    </button>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'font-bold rounded-full transition-all btn-press focus-ring inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl',
    secondary: 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30',
    success: 'bg-linear-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 shadow-lg',
    danger: 'bg-linear-to-r from-red-400 to-rose-500 text-white hover:from-red-500 hover:to-rose-600 shadow-lg',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

interface StarsDisplayProps {
  count: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StarsDisplay: React.FC<StarsDisplayProps> = ({
  count,
  maxStars = 3,
  size = 'md',
}) => {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };
  
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }).map((_, i) => (
        <span
          key={i}
          className={`${sizes[size]} transition-all duration-300 ${
            i < count ? 'star-gold animate-pop' : 'opacity-30'
          }`}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
};

// Pre-computed confetti data to avoid Math.random during render
interface ConfettiItem {
  id: number;
  left: string;
  top: string;
  fontSize: string;
  animationDuration: string;
  animationDelay: string;
  emoji: string;
}

export const Confetti: React.FC<{ show: boolean }> = ({ show }) => {
  const confettiColors = ['🎉', '🎊', '✨', '🌟', '💫', '🎈'];
  
  // Use useMemo to compute confetti positions only once
  const confettiItems = useMemo<ConfettiItem[]>(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 2 + 1}rem`,
      animationDuration: `${Math.random() * 2 + 2}s`,
      animationDelay: `${Math.random() * 0.5}s`,
      emoji: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    }));
  }, []);

  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiItems.map((item) => (
        <div
          key={item.id}
          className="absolute animate-pop"
          style={{
            left: item.left,
            top: item.top,
            fontSize: item.fontSize,
            animation: `confetti ${item.animationDuration} ease-out forwards`,
            animationDelay: item.animationDelay,
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
};

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showLabel = true,
}) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-white/70 mb-1">
          <span>Progress</span>
          <span>{current} / {total}</span>
        </div>
      )}
      <div className="h-4 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface AvatarSelectorProps {
  avatars: string[];
  selected: string;
  onSelect: (avatar: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  avatars,
  selected,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {avatars.map((avatar) => (
        <button
          key={avatar}
          onClick={() => onSelect(avatar)}
          className={`text-4xl p-3 rounded-2xl transition-all btn-press ${
            selected === avatar
              ? 'bg-yellow-400 scale-110 shadow-lg animate-pulse-glow'
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          {avatar}
        </button>
      ))}
    </div>
  );
};

interface ResultModalProps {
  show: boolean;
  correct: boolean;
  onContinue: () => void;
  message?: string;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  show,
  correct,
  onContinue,
  message,
}) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 animate-pop">
      <div className={`p-8 rounded-3xl text-center ${correct ? 'bg-gradient-forest' : 'bg-gradient-candy'}`}>
        <div className="text-7xl mb-4 animate-bounce-slow">
          {correct ? '🎉' : '💪'}
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 text-shadow">
          {correct ? 'Great Job!' : 'Try Again!'}
        </h2>
        <p className="text-white/80 mb-6">
          {message || (correct ? 'You did amazing!' : "You're getting better!")}
        </p>
        <Button variant={correct ? 'primary' : 'secondary'} size="lg" onClick={onContinue}>
          {correct ? 'Continue ➡️' : 'Keep Going 💪'}
        </Button>
      </div>
      {correct && <Confetti show={true} />}
    </div>
  );
};
