import { useCallback, useRef } from 'react';

// AudioContext for generating sounds
let audioContext: AudioContext | null = null;

interface WebkitWindow extends Window {
  webkitAudioContext: typeof AudioContext;
}

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as WebkitWindow).webkitAudioContext)();
  }
  return audioContext;
};

// Generate a beep sound
const playBeep = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    console.log('Audio not available');
  }
};

// Play a sequence of notes for celebration
const playCelebration = () => {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => playBeep(freq, 0.15, 'sine', 0.2), i * 100);
  });
};

// Play correct answer sound
const playCorrect = () => {
  playBeep(880, 0.1, 'sine', 0.2); // A5
  setTimeout(() => playBeep(1108.73, 0.15, 'sine', 0.2), 100); // C#6
};

// Play wrong answer sound
const playWrong = () => {
  playBeep(200, 0.2, 'sawtooth', 0.15);
};

// Play click sound
const playClick = () => {
  playBeep(600, 0.05, 'sine', 0.1);
};

// Play start game sound
const playStart = () => {
  playBeep(440, 0.1, 'sine', 0.2); // A4
  setTimeout(() => playBeep(554.37, 0.1, 'sine', 0.2), 100); // C#5
  setTimeout(() => playBeep(659.25, 0.15, 'sine', 0.2), 200); // E5
};

export type SoundType = 'correct' | 'wrong' | 'click' | 'celebration' | 'start';

export const useSound = () => {
  const isMutedRef = useRef(false);
  
  const playSound = useCallback((type: SoundType) => {
    if (isMutedRef.current) return;
    
    switch (type) {
      case 'correct':
        playCorrect();
        break;
      case 'wrong':
        playWrong();
        break;
      case 'click':
        playClick();
        break;
      case 'celebration':
        playCelebration();
        break;
      case 'start':
        playStart();
        break;
    }
  }, []);

  const toggleMute = useCallback(() => {
    isMutedRef.current = !isMutedRef.current;
    return isMutedRef.current;
  }, []);

  const isMuted = useCallback(() => isMutedRef.current, []);

  return { playSound, toggleMute, isMuted };
};

// Hook to get comprehensive stats
export const useStats = () => {
  const getOverallStats = useCallback((progress: Record<string, { gamesPlayed: number; correctAnswers: number; totalAnswers: number; highestStreak: number }>) => {
    const games = Object.entries(progress);
    
    let totalGamesPlayed = 0;
    let totalCorrect = 0;
    let totalAnswers = 0;
    let highestStreak = 0;
    
    games.forEach(([, stats]) => {
      totalGamesPlayed += stats.gamesPlayed;
      totalCorrect += stats.correctAnswers;
      totalAnswers += stats.totalAnswers;
      highestStreak = Math.max(highestStreak, stats.highestStreak);
    });
    
    const accuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;
    
    return {
      totalGamesPlayed,
      totalCorrect,
      totalAnswers,
      highestStreak,
      accuracy,
    };
  }, []);

  return { getOverallStats };
};
