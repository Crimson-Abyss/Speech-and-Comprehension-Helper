import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { stories } from '../data/gameData';
import type { Story } from '../data/gameData';
import { Button, ProgressBar, ResultModal, Confetti } from '../components/GameComponents';
import { useSound } from '../hooks/useSound';

interface PictureStoryProps {
  onExit: () => void;
}

export const PictureStory: React.FC<PictureStoryProps> = ({ onExit }) => {
  const { recordAnswer, currentStreak, addAchievement } = useGameStore();
  const { playSound } = useSound();
  
  // Use useMemo for random story selection to avoid re-renders
  const currentStory = useMemo<Story>(() => {
    return stories[Math.floor(Math.random() * stories.length)];
  }, []);
  
  const [phase, setPhase] = useState<'reading' | 'questions'>('reading');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const handleStartQuestions = () => {
    playSound('click');
    setPhase('questions');
  };

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null || !currentStory) return;
    
    setSelectedAnswer(index);
    const correct = index === currentStory.questions[questionIndex].correctIndex;
    setIsCorrect(correct);
    
    setTimeout(() => {
      setShowResult(true);
      recordAnswer('picture-story', correct);
      
      if (correct) {
        playSound('correct');
        setCorrectCount(prev => prev + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        
        if (currentStreak >= 4) {
          addAchievement('📚 Story Master!');
        }
      } else {
        playSound('wrong');
      }
    }, 500);
  };

  const handleContinue = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    
    if (currentStory && questionIndex < currentStory.questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      if (correctCount >= 2) {
        addAchievement('📖 Bookworm!');
      }
      onExit();
    }
  };

  if (!currentStory) {
    return (
      <div className="min-h-screen bg-gradient-sunny flex items-center justify-center">
        <div className="text-white text-xl">Loading story...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sunny p-4">
      <Confetti show={showConfetti} />
      
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="secondary" size="sm" onClick={onExit}>
            ← Back
          </Button>
          <div className="text-white font-bold text-lg">
            {currentStory.emoji} {currentStory.title}
          </div>
        </div>
        
        {phase === 'questions' && (
          <ProgressBar 
            current={questionIndex + 1} 
            total={currentStory.questions.length} 
          />
        )}
      </div>

      {phase === 'reading' && (
        <div className="max-w-2xl mx-auto mt-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center text-shadow">
            📖 Read the Story
          </h1>
          
          <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 md:p-8 glass">
            <div className="text-center text-6xl mb-6 animate-bounce-slow">
              {currentStory.emoji}
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-6 text-shadow">
              {currentStory.title}
            </h2>
            
            <div className="space-y-4">
              {currentStory.paragraphs.map((paragraph, index) => (
                <p 
                  key={index}
                  className="text-white text-xl leading-relaxed text-center animate-pop"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button variant="success" size="lg" onClick={handleStartQuestions}>
              I'm Ready for Questions! 📝
            </Button>
          </div>
        </div>
      )}

      {phase === 'questions' && (
        <div className="max-w-2xl mx-auto mt-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center text-shadow">
            ❓ Question Time!
          </h1>
          
          <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 md:p-8 glass mb-6">
            <p className="text-2xl font-bold text-white text-center mb-8 text-shadow">
              {currentStory.questions[questionIndex].question}
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              {currentStory.questions[questionIndex].options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentStory.questions[questionIndex].correctIndex;
                const showFeedback = selectedAnswer !== null;
                
                let bgColor = 'bg-white/20 hover:bg-white/30';
                if (showFeedback) {
                  if (isCorrectAnswer) {
                    bgColor = 'bg-green-500/60';
                  } else if (isSelected && !isCorrectAnswer) {
                    bgColor = 'bg-red-500/60 animate-shake';
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-2xl text-white text-xl font-semibold flex items-center gap-4 transition-all btn-press ${bgColor}`}
                  >
                    <span className="text-4xl">{option.emoji}</span>
                    <span>{option.text}</span>
                    {showFeedback && isCorrectAnswer && (
                      <span className="ml-auto text-2xl">✓</span>
                    )}
                    {showFeedback && isSelected && !isCorrectAnswer && (
                      <span className="ml-auto text-2xl">✗</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <ResultModal
        show={showResult}
        correct={isCorrect}
        onContinue={handleContinue}
        message={isCorrect 
          ? "That's right! You're a great reader! 📚" 
          : "Good try! Keep reading and you'll get even better!"
        }
      />
    </div>
  );
};
