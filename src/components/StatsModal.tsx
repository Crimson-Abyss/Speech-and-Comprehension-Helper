import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useStats } from '../hooks/useSound';
import { Button } from './GameComponents';

interface StatsModalProps {
  show: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ show, onClose }) => {
  const { progress, player } = useGameStore();
  const { getOverallStats } = useStats();
  
  if (!show) return null;
  
  const stats = getOverallStats(progress);
  
  const gameLabels: Record<string, { name: string; emoji: string }> = {
    'word-sound': { name: 'Word Sound Match', emoji: '🎤' },
    'picture-story': { name: 'Picture Story', emoji: '📖' },
    'rhyme-time': { name: 'Rhyme Time', emoji: '🎵' },
    'listen-choose': { name: 'Listen & Choose', emoji: '👂' },
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-linear-to-br from-indigo-600 to-purple-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto glass">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-shadow">
            📊 Your Stats
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-sm sm:text-base"
          >
            ✕
          </button>
        </div>

        {/* Player Info */}
        <div className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
          <div className="text-4xl sm:text-5xl">{player.avatar}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white truncate">{player.name}</h3>
            <p className="text-white/70 text-sm">Level {player.level} Explorer</p>
          </div>
          <div className="text-center flex-shrink-0">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{player.totalStars}</div>
            <div className="text-white/70 text-xs">⭐ Stars</div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">{stats.totalGamesPlayed}</div>
            <div className="text-white/70 text-xs">Games Played</div>
          </div>
          <div className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-400">{stats.accuracy}%</div>
            <div className="text-white/70 text-xs">Accuracy</div>
          </div>
          <div className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-orange-400">{stats.highestStreak}</div>
            <div className="text-white/70 text-xs">🔥 Best Streak</div>
          </div>
          <div className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.totalCorrect}</div>
            <div className="text-white/70 text-xs">Correct Answers</div>
          </div>
        </div>

        {/* Per-Game Stats */}
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Game Breakdown</h3>
        <div className="space-y-2 sm:space-y-3">
          {Object.entries(progress).map(([gameKey, gameStats]) => {
            const label = gameLabels[gameKey] || { name: gameKey, emoji: '🎮' };
            const gameAccuracy = gameStats.totalAnswers > 0 
              ? Math.round((gameStats.correctAnswers / gameStats.totalAnswers) * 100) 
              : 0;
            
            return (
              <div key={gameKey} className="bg-white/10 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                  <span className="text-xl sm:text-2xl">{label.emoji}</span>
                  <span className="text-white font-semibold flex-1 text-sm sm:text-base truncate">{label.name}</span>
                  <span className="text-white/70 text-xs sm:text-sm flex-shrink-0">{gameStats.gamesPlayed} games</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                      style={{ width: `${gameAccuracy}%` }}
                    />
                  </div>
                  <span className="text-white text-xs sm:text-sm font-semibold w-10 sm:w-12">{gameAccuracy}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        {player.achievements.length > 0 && (
          <>
            <h3 className="text-base sm:text-lg font-bold text-white mt-4 sm:mt-6 mb-2 sm:mb-3">🏆 Achievements</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {player.achievements.map((achievement, i) => (
                <div
                  key={i}
                  className="bg-yellow-500/20 border border-yellow-500/40 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-white text-xs sm:text-sm"
                >
                  {achievement}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Close Button */}
        <div className="mt-4 sm:mt-6 text-center">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
