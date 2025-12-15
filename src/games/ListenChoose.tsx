import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useTextToSpeech } from '../hooks/useSpeechRecognition';
import { useSound } from '../hooks/useSound';
import { words } from '../data/gameData';
import type { Word } from '../data/gameData';
import { Button, ProgressBar, ResultModal, Confetti } from '../components/GameComponents';

interface ListenChooseProps {
  onExit: () => void;
}

export const ListenChoose: React.FC<ListenChooseProps> = ({ onExit }) => {
  const { recordAnswer, currentStreak, addAchievement } = useGameStore();
  const { speak } = useTextToSpeech();
  const { playSound } = useSound();
  
  // Use useMemo for game rounds to avoid re-renders
  const rounds = useMemo<{ target: Word; options: Word[] }[]>(() => {
    const simpleWords = words.filter(w => w.word.split(' ').length === 1);
    const shuffled = [...simpleWords].sort(() => Math.random() - 0.5);
    
    const gameRounds: { target: Word; options: Word[] }[] = [];
    const TOTAL_ROUNDS = 5;
    
    for (let i = 0; i < TOTAL_ROUNDS && i * 4 < shuffled.length; i++) {
      const target = shuffled[i * 4];
      const otherWords = shuffled
        .filter(w => w.word !== target.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [...otherWords, target].sort(() => Math.random() - 0.5);
      gameRounds.push({ target, options });
    }
    
    return gameRounds;
  }, []);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const currentRound = rounds[currentIndex];
  const TOTAL_ROUNDS = rounds.length;

  const handlePlaySound = useCallback(() => {
    if (currentRound) {
      speak(currentRound.target.word);
      setHasPlayed(true);
    }
  }, [currentRound, speak]);

  // Auto-play word when round changes
  useEffect(() => {
    if (currentRound && !hasPlayed) {
      const timer = setTimeout(() => {
        handlePlaySound();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentRound, hasPlayed, handlePlaySound]);

  const handleSelectWord = (word: Word) => {
    if (selectedWord !== null || !currentRound) return;
    
    setSelectedWord(word.word);
    const correct = word.word === currentRound.target.word;
    setIsCorrect(correct);
    
    setTimeout(() => {
      setShowResult(true);
      recordAnswer('listen-choose', correct);
      
      if (correct) {
        playSound('correct');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        
        if (currentStreak >= 4) {
          addAchievement('👂 Super Listener!');
        }
      } else {
        playSound('wrong');
      }
    }, 500);
  };

  const handleContinue = () => {
    setShowResult(false);
    setSelectedWord(null);
    setHasPlayed(false);
    
    if (currentIndex < rounds.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      addAchievement('🎧 Listening Star!');
      onExit();
    }
  };

  if (!currentRound) {
    return (
      <div className="min-h-screen bg-gradient-candy flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-candy p-3 sm:p-4">
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
          👂 Listen & Choose!
        </h1>
        <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base">
          Tap the speaker, then pick the matching picture
        </p>
        
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handlePlaySound}
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white/30 backdrop-blur-lg hover:bg-white/40 transition-all shadow-2xl flex items-center justify-center mx-auto btn-press animate-pulse-glow"
          >
            <span className="text-4xl sm:text-5xl md:text-6xl">🔊</span>
          </button>
          <p className="text-white/80 mt-3 sm:mt-4 text-sm sm:text-base">
            {hasPlayed ? 'Tap to hear again!' : 'Tap to hear the word'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          {currentRound.options.map((option) => {
            const isSelected = selectedWord === option.word;
            const isTarget = option.word === currentRound.target.word;
            const showFeedback = selectedWord !== null;
            
            let bgColor = 'bg-white/20 hover:bg-white/30';
            if (showFeedback) {
              if (isTarget) {
                bgColor = 'bg-green-500/60';
              } else if (isSelected && !isTarget) {
                bgColor = 'bg-red-500/60 animate-shake';
              }
            }
            
            return (
              <button
                key={option.word}
                onClick={() => handleSelectWord(option)}
                disabled={selectedWord !== null}
                className={`p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl transition-all btn-press card-hover ${bgColor}`}
              >
                <div className="text-4xl sm:text-5xl md:text-6xl mb-1 sm:mb-2">{option.emoji}</div>
                {showFeedback && (
                  <div className="text-sm sm:text-base md:text-lg font-bold text-white text-shadow">
                    {option.word.toUpperCase()}
                  </div>
                )}
                {showFeedback && isTarget && (
                  <div className="text-green-300 mt-1 sm:mt-2 text-xs sm:text-sm">✓ Correct!</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white/10 rounded-xl">
          <p className="text-white/70 text-xs sm:text-sm">
            💡 Tip: Listen carefully to each sound in the word!
          </p>
        </div>
      </div>

      <ResultModal
        show={showResult}
        correct={isCorrect}
        onContinue={handleContinue}
        message={isCorrect 
          ? `Yes! That's "${currentRound.target.word}"! 🎉` 
          : `The word was "${currentRound.target.word}". Keep listening!`
        }
      />
    </div>
  );
};
