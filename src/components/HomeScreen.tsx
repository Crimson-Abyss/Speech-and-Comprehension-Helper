import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { GameType } from '../store/gameStore';
import { GameCard, Button, AvatarSelector } from './GameComponents';
import { StatsModal } from './StatsModal';
import { Leaderboard } from './Leaderboard';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import { avatars } from '../data/gameData';

interface HomeScreenProps {
  onStartGame: (game: GameType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame }) => {
  const { player, progress, setPlayerName, setPlayerAvatar } = useGameStore();
  const { signOut, isOnline, user } = useAuth();
  const { playSound, toggleMute } = useSound();
  const [showSetup, setShowSetup] = useState(!player.name);
  const [showStats, setShowStats] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [tempName, setTempName] = useState(player.name);
  const [soundMuted, setSoundMuted] = useState(false);

  const games = [
    {
      type: 'word-sound' as GameType,
      title: 'Word Sound Match',
      description: 'Speak words and learn pronunciation!',
      emoji: '🎤',
      gradient: 'bg-gradient-kids',
    },
    {
      type: 'picture-story' as GameType,
      title: 'Picture Story',
      description: 'Read stories and answer questions!',
      emoji: '📖',
      gradient: 'bg-gradient-sunny',
    },
    {
      type: 'rhyme-time' as GameType,
      title: 'Rhyme Time',
      description: 'Find words that rhyme together!',
      emoji: '🎵',
      gradient: 'bg-gradient-ocean',
    },
    {
      type: 'listen-choose' as GameType,
      title: 'Listen & Choose',
      description: 'Hear words and pick the picture!',
      emoji: '👂',
      gradient: 'bg-gradient-candy',
    },
  ];

  const getTotalProgress = () => {
    return Object.values(progress).reduce(
      (acc, p) => ({
        gamesPlayed: acc.gamesPlayed + p.gamesPlayed,
        correctAnswers: acc.correctAnswers + p.correctAnswers,
        totalAnswers: acc.totalAnswers + p.totalAnswers,
      }),
      { gamesPlayed: 0, correctAnswers: 0, totalAnswers: 0 }
    );
  };

  const totalProgress = getTotalProgress();
  const accuracy = totalProgress.totalAnswers > 0 
    ? Math.round((totalProgress.correctAnswers / totalProgress.totalAnswers) * 100) 
    : 0;

  const handleSaveProfile = () => {
    if (tempName.trim()) {
      playSound('celebration');
      setPlayerName(tempName.trim());
      setShowSetup(false);
    }
  };

  const handleStartGame = (game: GameType) => {
    playSound('start');
    onStartGame(game);
  };

  const handleToggleMute = () => {
    const muted = toggleMute();
    setSoundMuted(muted);
  };

  // Setup screen for new players
  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full glass">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4 animate-bounce-slow">🌟</div>
            <h1 className="text-3xl font-bold text-white text-shadow mb-2">
              Welcome!
            </h1>
            <p className="text-white/80">
              Let's set up your profile
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">
                What's your name?
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 text-lg"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">
                Pick your avatar!
              </label>
              <AvatarSelector
                avatars={avatars}
                selected={player.avatar}
                onSelect={(avatar) => {
                  playSound('click');
                  setPlayerAvatar(avatar);
                }}
              />
            </div>

            <Button
              variant="success"
              size="lg"
              onClick={handleSaveProfile}
              disabled={!tempName.trim()}
              className="w-full"
            >
              Let's Play! 🎮
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Stats Modal */}
      <StatsModal show={showStats} onClose={() => setShowStats(false)} />
      
      {/* Leaderboard Modal */}
      <Leaderboard show={showLeaderboard} onClose={() => setShowLeaderboard(false)} />

      {/* Header */}
      <header className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-wiggle">{player.avatar}</div>
            <div>
              <h2 className="text-white font-bold text-lg">
                Hi, {player.name}! 👋
              </h2>
              <p className="text-white/70 text-sm">
                Level {player.level} Explorer
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <span className="text-2xl star-gold">⭐</span>
              <span className="text-white font-bold text-lg">{player.totalStars}</span>
            </div>
            <button
              onClick={() => {
                playSound('click');
                setShowStats(true);
              }}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-xl"
              title="Stats"
            >
              📊
            </button>
            <button
              onClick={handleToggleMute}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-xl"
              title={soundMuted ? 'Unmute' : 'Mute'}
            >
              {soundMuted ? '🔇' : '🔊'}
            </button>
            {isOnline && (
              <button
                onClick={() => {
                  playSound('click');
                  setShowLeaderboard(true);
                }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-xl"
                title="Leaderboard"
              >
                🏆
              </button>
            )}
            <button
              onClick={() => setShowSetup(true)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-xl"
              title="Settings"
            >
              ⚙️
            </button>
            {isOnline && user && (
              <button
                onClick={signOut}
                className="w-10 h-10 rounded-full bg-red-500/40 flex items-center justify-center text-white hover:bg-red-500/60 transition-colors text-xl"
                title="Sign Out"
              >
                🚪
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Stats summary banner */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-8 glass">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="text-6xl animate-float">🚀</div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white text-shadow mb-2">
                  Ready to Learn?
                </h1>
                <p className="text-white/80">
                  You've played {totalProgress.gamesPlayed} games with {accuracy}% accuracy! Keep it up! 🎉
                </p>
              </div>
              {/* Quick Stats */}
              <div className="flex gap-3">
                <div className="bg-white/20 rounded-2xl px-4 py-3 text-center">
                  <div className="text-2xl font-bold text-white">{totalProgress.gamesPlayed}</div>
                  <div className="text-white/70 text-xs">Games</div>
                </div>
                <div className="bg-white/20 rounded-2xl px-4 py-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
                  <div className="text-white/70 text-xs">Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Games grid */}
          <h2 className="text-xl font-bold text-white mb-4 text-shadow">
            Choose a Game
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {games.map((game) => (
              <GameCard
                key={game.type}
                title={game.title}
                description={game.description}
                emoji={game.emoji}
                gradient={game.gradient}
                onClick={() => handleStartGame(game.type)}
                stars={progress[game.type]?.correctAnswers || 0}
                gamesPlayed={progress[game.type]?.gamesPlayed || 0}
              />
            ))}
          </div>

          {/* Achievements section */}
          {player.achievements.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-white mb-4 text-shadow">
                Your Achievements 🏆
              </h2>
              <div className="flex flex-wrap gap-2">
                {player.achievements.map((achievement) => (
                  <div
                    key={achievement}
                    className="bg-yellow-400/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm"
                  >
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-white/50 text-sm">
        Speech & Learn - Helping kids grow! 🌱
      </footer>
    </div>
  );
};
