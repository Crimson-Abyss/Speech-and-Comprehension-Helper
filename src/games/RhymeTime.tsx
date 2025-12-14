import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { rhymeSets } from '../data/gameData';
import type { RhymeSet } from '../data/gameData';
import { Button, ProgressBar, ResultModal, Confetti } from '../components/GameComponents';
import { useSound } from '../hooks/useSound';

interface RhymeTimeProps {
  onExit: () => void;
}

export const RhymeTime: React.FC<RhymeTimeProps> = ({ onExit }) => {
  const { recordAnswer, currentStreak, addAchievement } = useGameStore();
  const { playSound } = useSound();
  
  // Use useMemo for game rhymes to avoid re-renders
  const gameRhymes = useMemo<RhymeSet[]>(() => {
    return [...rhymeSets]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  }, []);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  
  // Shuffle options once per round using useMemo
  const shuffledOptions = useMemo(() => {
    if (!gameRhymes[currentIndex]) return [];
    return [...gameRhymes[currentIndex].options].sort(() => Math.random() - 0.5);
  }, [gameRhymes, currentIndex]);

  const currentRhyme = gameRhymes[currentIndex];
  const TOTAL_ROUNDS = gameRhymes.length;

  const handleSelectWord = (word: string, isRhyme: boolean) => {
    if (selectedWord !== null) return;
    
    setSelectedWord(word);
    setIsCorrect(isRhyme);
    
    setTimeout(() => {
      setShowResult(true);
      recordAnswer('rhyme-time', isRhyme);
      
      if (isRhyme) {
        playSound('correct');
        setCorrectCount(prev => prev + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        
        if (currentStreak >= 4) {
          addAchievement('🎵 Rhyme Master!');
        }
      } else {
        playSound('wrong');
      }
    }, 500);
  };

  const handleContinue = () => {
    setShowResult(false);
    setSelectedWord(null);
    
    if (currentIndex < gameRhymes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if (correctCount >= 4) {
        addAchievement('🎶 Poet Expert!');
      }
      onExit();
    }
  };

  if (!currentRhyme) {
    return (
      <div className="min-h-screen bg-gradient-ocean flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-ocean p-4">
      <Confetti show={showConfetti} />
      
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="secondary" size="sm" onClick={onExit}>
            ← Back
          </Button>
          <div className="text-white font-bold">
            🔥 Streak: {currentStreak}
          </div>
        </div>
        
        <ProgressBar current={currentIndex + 1} total={TOTAL_ROUNDS} />
      </div>

      <div className="max-w-2xl mx-auto mt-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4 text-shadow">
          🎵 Find the Rhyme!
        </h1>
        <p className="text-white/80 mb-8">
          Which word rhymes with...
        </p>
        
        <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 glass mb-8">
          <div className="text-7xl mb-4 animate-bounce-slow">
            {currentRhyme.targetEmoji}
          </div>
          <div className="text-4xl font-bold text-white text-shadow">
            {currentRhyme.targetWord.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {shuffledOptions.map((option) => {
            const isSelected = selectedWord === option.word;
            const showFeedback = selectedWord !== null;
            
            let bgColor = 'bg-white/20 hover:bg-white/30';
            if (showFeedback) {
              if (option.isRhyme) {
                bgColor = 'bg-green-500/60';
              } else if (isSelected && !option.isRhyme) {
                bgColor = 'bg-red-500/60 animate-shake';
              }
            }
            
            return (
              <button
                key={option.word}
                onClick={() => handleSelectWord(option.word, option.isRhyme)}
                disabled={selectedWord !== null}
                className={`p-6 rounded-2xl transition-all btn-press card-hover ${bgColor}`}
              >
                <div className="text-5xl mb-2">{option.emoji}</div>
                <div className="text-xl font-bold text-white text-shadow">
                  {option.word.toUpperCase()}
                </div>
                {showFeedback && option.isRhyme && (
                  <div className="text-green-300 mt-2">✓ Rhymes!</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-white/10 rounded-xl">
          <p className="text-white/70 text-sm">
            💡 Tip: Rhyming words have the same ending sound!
          </p>
        </div>
      </div>

      <ResultModal
        show={showResult}
        correct={isCorrect}
        onContinue={handleContinue}
        message={isCorrect 
          ? `Great! "${selectedWord}" rhymes with "${currentRhyme.targetWord}"! 🎶` 
          : `Not quite! Look for words that end with the same sound.`
        }
      />
    </div>
  );
};
