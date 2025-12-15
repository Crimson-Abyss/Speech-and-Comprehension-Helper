import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useSpeechRecognition, useTextToSpeech } from '../hooks/useSpeechRecognition';
import { useSound } from '../hooks/useSound';
import { words } from '../data/gameData';
import type { Word } from '../data/gameData';
import { Button, ProgressBar, ResultModal, Confetti } from '../components/GameComponents';

interface WordSoundMatchProps {
  onExit: () => void;
}

// Simple Levenshtein distance for fuzzy matching
const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

export const WordSoundMatch: React.FC<WordSoundMatchProps> = ({ onExit }) => {
  const { recordAnswer, currentStreak, addAchievement } = useGameStore();
  const { isListening, transcript, isSupported, startListening, resetTranscript } = useSpeechRecognition();
  const { speak } = useTextToSpeech();
  const { playSound } = useSound();
  
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasProcessedRef = useRef(false);
  const TOTAL_ROUNDS = 5;

  // Initialize game words
  useEffect(() => {
    const shuffled = [...words]
      .filter(w => w.word.split(' ').length === 1)
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL_ROUNDS);
    setGameWords(shuffled);
  }, []);

  const currentWord = gameWords[currentIndex];

  // Check transcript when it changes
  useEffect(() => {
    if (transcript && currentWord && !hasProcessedRef.current) {
      hasProcessedRef.current = true;
      const spoken = transcript.toLowerCase().trim();
      const target = currentWord.word.toLowerCase();
      
      const correct = spoken === target || 
        spoken.includes(target) || 
        target.includes(spoken) ||
        levenshteinDistance(spoken, target) <= 2;
      
      setIsCorrect(correct);
      setShowResult(true);
      recordAnswer('word-sound', correct);
      
      if (correct) {
        playSound('correct');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        
        if (currentStreak >= 4) {
          addAchievement('🔥 5 in a Row!');
        }
      } else {
        playSound('wrong');
      }
    }
  }, [transcript, currentWord, currentStreak, recordAnswer, addAchievement, playSound]);

  const handleSpeak = () => {
    if (currentWord) {
      speak(currentWord.word);
    }
  };

  const handleListen = () => {
    hasProcessedRef.current = false;
    resetTranscript();
    startListening();
  };

  const handleContinue = () => {
    setShowResult(false);
    hasProcessedRef.current = false;
    resetTranscript();
    
    if (currentIndex < gameWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onExit();
    }
  };

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-kids flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-kids p-3 sm:p-4">
      <Confetti show={showConfetti} />
      
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Button variant="secondary" size="sm" onClick={onExit}>
            ← Back
          </Button>
          <div className="text-white font-bold text-sm sm:text-base">
            🔥 Streak: {currentStreak}
          </div>
        </div>
        
        <ProgressBar current={currentIndex + 1} total={TOTAL_ROUNDS} />
      </div>

      <div className="max-w-2xl mx-auto mt-6 sm:mt-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 text-shadow">
          🎤 Say This Word!
        </h1>
        
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 glass mb-6 sm:mb-8">
          <div className="text-6xl sm:text-7xl md:text-9xl mb-3 sm:mb-4 animate-bounce-slow">
            {currentWord.emoji}
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-shadow mb-3 sm:mb-4">
            {currentWord.word.toUpperCase()}
          </div>
          
          <Button variant="secondary" onClick={handleSpeak} className="mb-2 sm:mb-4 text-sm sm:text-base">
            🔊 Hear Word
          </Button>
        </div>

        {isSupported ? (
          <div className="mb-4 sm:mb-6">
            <button
              onClick={handleListen}
              disabled={isListening}
              className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full transition-all ${
                isListening 
                  ? 'bg-red-500 animate-pulse scale-110' 
                  : 'bg-linear-to-r from-green-400 to-emerald-500 hover:scale-105'
              } shadow-2xl flex items-center justify-center mx-auto`}
            >
              <span className="text-4xl sm:text-5xl md:text-6xl">
                {isListening ? '🎤' : '🎤'}
              </span>
            </button>
            <p className="text-white/80 mt-3 sm:mt-4 text-sm sm:text-base">
              {isListening ? 'Listening... Speak now!' : 'Tap to speak'}
            </p>
            
            {transcript && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white/10 rounded-xl">
                <p className="text-white/60 text-xs sm:text-sm">You said:</p>
                <p className="text-white text-lg sm:text-xl md:text-2xl font-bold">"{transcript}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-500/20 rounded-xl p-3 sm:p-4 text-white">
            <p className="mb-2 text-sm sm:text-base">⚠️ Speech recognition not supported in this browser</p>
            <p className="text-xs sm:text-sm opacity-80">Try using Chrome or Edge for the best experience</p>
          </div>
        )}
      </div>

      <ResultModal
        show={showResult}
        correct={isCorrect}
        onContinue={handleContinue}
        message={isCorrect 
          ? `Perfect! "${currentWord.word}" is correct! 🌟` 
          : `Good try! The word was "${currentWord.word}". Keep practicing!`
        }
      />
    </div>
  );
};
