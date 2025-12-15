import React, { useEffect, useState } from 'react';
import { useLeaderboard } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './GameComponents';

interface LeaderboardProps {
  show: boolean;
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ show, onClose }) => {
  const { leaders, loading, fetchLeaderboard } = useLeaderboard();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (show) {
      fetchLeaderboard();
    }
  }, [show, fetchLeaderboard]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-linear-to-br from-yellow-500 to-orange-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto glass">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-shadow flex items-center gap-2">
            🏆 Leaderboard
          </h2>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-sm sm:text-base"
            >
              {refreshing ? '⏳' : '🔄'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-sm sm:text-base"
            >
              ✕
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-5xl animate-bounce">⏳</div>
            <p className="text-white/80 mt-3 sm:mt-4 text-sm sm:text-base">Loading top players...</p>
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-5xl">🌟</div>
            <p className="text-white/80 mt-3 sm:mt-4 text-sm sm:text-base">No players yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {leaders.map((leader, index) => {
              const isCurrentUser = user?.id === leader.id;
              const medals = ['🥇', '🥈', '🥉'];
              const medal = medals[index] || (index + 1).toString();

              return (
                <div
                  key={leader.id}
                  className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                    isCurrentUser
                      ? 'bg-white/30 border-2 border-white'
                      : 'bg-white/10'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl w-8 sm:w-10 text-center flex-shrink-0">
                    {medal}
                  </div>
                  <div className="text-3xl sm:text-4xl flex-shrink-0">
                    {leader.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-base sm:text-lg truncate">
                      {leader.name}
                      {isCurrentUser && <span className="text-xs sm:text-sm opacity-70"> (You)</span>}
                    </div>
                    <div className="text-white/70 text-xs sm:text-sm">
                      Level {leader.level}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-300">
                      {leader.total_stars}
                    </div>
                    <div className="text-white/70 text-xs">⭐ Stars</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-4">
            Earn stars by playing games and getting answers right!
          </p>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
