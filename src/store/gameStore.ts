import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameType = 'word-sound' | 'picture-story' | 'rhyme-time' | 'listen-choose';

export interface GameProgress {
  gamesPlayed: number;
  correctAnswers: number;
  totalAnswers: number;
  highestStreak: number;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  totalStars: number;
  level: number;
  achievements: string[];
}

interface GameState {
  currentScreen: 'home' | 'game' | 'results';
  currentGame: GameType | null;
  player: PlayerProfile;
  progress: Record<GameType, GameProgress>;
  currentStreak: number;
  
  // Actions
  setScreen: (screen: 'home' | 'game' | 'results') => void;
  startGame: (game: GameType) => void;
  endGame: () => void;
  recordAnswer: (game: GameType, correct: boolean) => void;
  addStars: (amount: number) => void;
  setPlayerName: (name: string) => void;
  setPlayerAvatar: (avatar: string) => void;
  addAchievement: (achievement: string) => void;
  resetProgress: () => void;
}

const initialProgress: GameProgress = {
  gamesPlayed: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  highestStreak: 0,
};

const initialPlayer: PlayerProfile = {
  name: '',
  avatar: '🦁',
  totalStars: 0,
  level: 1,
  achievements: [],
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentScreen: 'home',
      currentGame: null,
      player: initialPlayer,
      progress: {
        'word-sound': { ...initialProgress },
        'picture-story': { ...initialProgress },
        'rhyme-time': { ...initialProgress },
        'listen-choose': { ...initialProgress },
      },
      currentStreak: 0,

      setScreen: (screen) => set({ currentScreen: screen }),

      startGame: (game) => set({ 
        currentGame: game, 
        currentScreen: 'game',
        currentStreak: 0,
      }),

      endGame: () => {
        const { currentGame, progress } = get();
        if (currentGame) {
          set({
            currentScreen: 'results',
            progress: {
              ...progress,
              [currentGame]: {
                ...progress[currentGame],
                gamesPlayed: progress[currentGame].gamesPlayed + 1,
              },
            },
          });
        }
      },

      recordAnswer: (game, correct) => {
        const { progress, currentStreak, player } = get();
        const gameProgress = progress[game];
        const newStreak = correct ? currentStreak + 1 : 0;
        const starsEarned = correct ? (newStreak >= 3 ? 2 : 1) : 0;

        set({
          currentStreak: newStreak,
          player: {
            ...player,
            totalStars: player.totalStars + starsEarned,
            level: Math.floor((player.totalStars + starsEarned) / 50) + 1,
          },
          progress: {
            ...progress,
            [game]: {
              ...gameProgress,
              correctAnswers: gameProgress.correctAnswers + (correct ? 1 : 0),
              totalAnswers: gameProgress.totalAnswers + 1,
              highestStreak: Math.max(gameProgress.highestStreak, newStreak),
            },
          },
        });
      },

      addStars: (amount) => {
        const { player } = get();
        set({
          player: {
            ...player,
            totalStars: player.totalStars + amount,
            level: Math.floor((player.totalStars + amount) / 50) + 1,
          },
        });
      },

      setPlayerName: (name) => {
        const { player } = get();
        set({ player: { ...player, name } });
      },

      setPlayerAvatar: (avatar) => {
        const { player } = get();
        set({ player: { ...player, avatar } });
      },

      addAchievement: (achievement) => {
        const { player } = get();
        if (!player.achievements.includes(achievement)) {
          set({
            player: {
              ...player,
              achievements: [...player.achievements, achievement],
            },
          });
        }
      },

      resetProgress: () => set({
        progress: {
          'word-sound': { ...initialProgress },
          'picture-story': { ...initialProgress },
          'rhyme-time': { ...initialProgress },
          'listen-choose': { ...initialProgress },
        },
        player: initialPlayer,
      }),
    }),
    {
      name: 'speech-kids-game-storage',
    }
  )
);
