import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useGameStore } from './store/gameStore';
import type { GameType } from './store/gameStore';
import { HomeScreen } from './components/HomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { WordSoundMatch } from './games/WordSoundMatch';
import { PictureStory } from './games/PictureStory';
import { RhymeTime } from './games/RhymeTime';
import { ListenChoose } from './games/ListenChoose';
import { useProgressSync, useAchievements, useProfileStars } from './hooks/useDatabase';
import './index.css';

// Main app content with auth awareness
function AppContent() {
  const { user, profile, loading, isOnline } = useAuth();
  const { currentScreen, setScreen, endGame, setPlayerName, setPlayerAvatar, player, progress } = useGameStore();
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  const { loadProgress, saveProgress } = useProgressSync(user?.id ?? null);
  const { loadAchievements } = useAchievements(user?.id ?? null);
  const { updateStars } = useProfileStars();

  // Sync profile from database on login
  useEffect(() => {
    if (profile && !initialized) {
      setPlayerName(profile.name);
      setPlayerAvatar(profile.avatar);
      setInitialized(true);
      
      // Load progress from database
      loadProgress().then(dbProgress => {
        if (dbProgress) {
          // Merge with local progress if needed
          console.log('Loaded progress from database:', dbProgress);
        }
      });
      
      loadAchievements();
    }
  }, [profile, initialized, setPlayerName, setPlayerAvatar, loadProgress, loadAchievements]);

  // Sync progress to database when it changes
  useEffect(() => {
    if (user && initialized) {
      // Save each game's progress
      Object.entries(progress).forEach(([gameType, stats]) => {
        saveProgress(gameType, stats);
      });
      
      // Update stars in profile
      updateStars(user.id, player.totalStars, player.level);
    }
  }, [progress, player.totalStars, player.level, user, initialized, saveProgress, updateStars]);

  const handleStartGame = (game: GameType) => {
    setActiveGame(game);
    setScreen('game');
  };

  const handleExitGame = () => {
    endGame();
    setActiveGame(null);
    setScreen('home');
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl animate-bounce-slow">🎮</div>
          <p className="text-white text-xl mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if online but not logged in
  if (isOnline && !user) {
    return <AuthScreen />;
  }

  // Render active game
  if (currentScreen === 'game' && activeGame) {
    switch (activeGame) {
      case 'word-sound':
        return <WordSoundMatch onExit={handleExitGame} />;
      case 'picture-story':
        return <PictureStory onExit={handleExitGame} />;
      case 'rhyme-time':
        return <RhymeTime onExit={handleExitGame} />;
      case 'listen-choose':
        return <ListenChoose onExit={handleExitGame} />;
    }
  }

  // Default: Home screen
  return <HomeScreen onStartGame={handleStartGame} />;
}

// App wrapper with Auth Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
