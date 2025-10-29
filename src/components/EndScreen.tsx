import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, RotateCcw, Home, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const EndScreen = () => {
  const { showEndScreen, victory, score, highScore, closeEndScreen, resetGame } = useGameStore();
  
  useEffect(() => {
    if (showEndScreen && victory) {
      // Trigger confetti effect
      const colors = ['#FF6B9D', '#C44569', '#F8B500', '#00D2FF', '#3A7BD5'];
      const confettiCount = 50;
      
      for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
          createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 30);
      }
    }
  }, [showEndScreen, victory]);
  
  const createConfetti = (color: string) => {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-20px';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.pointerEvents = 'none';
    
    document.body.appendChild(confetti);
    
    const duration = 2000 + Math.random() * 1000;
    const rotation = Math.random() * 360;
    const xMovement = (Math.random() - 0.5) * 200;
    
    confetti.animate([
      {
        transform: `translate(0, 0) rotate(0deg)`,
        opacity: 1
      },
      {
        transform: `translate(${xMovement}px, ${window.innerHeight + 20}px) rotate(${rotation}deg)`,
        opacity: 0
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => {
      confetti.remove();
    };
  };
  
  const handlePlayAgain = () => {
    resetGame();
    closeEndScreen();
    useGameStore.getState().startGame();
  };
  
  const handleMainMenu = () => {
    resetGame();
    closeEndScreen();
  };
  
  return (
    <AnimatePresence>
      {showEndScreen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl shadow-2xl max-w-lg w-full border-2 border-purple-500/30 overflow-hidden">
              {/* Header */}
              <div className="relative p-8 text-center">
                {victory ? (
                  <>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                      className="flex justify-center mb-4"
                    >
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/50">
                        <Trophy className="w-12 h-12 text-white" />
                      </div>
                    </motion.div>
                    
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl text-white mb-2"
                    >
                      Victory!
                    </motion.h2>
                    
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center justify-center gap-2 text-yellow-400"
                    >
                      <Sparkles className="w-5 h-5" />
                      <p className="text-lg">You completed the quest!</p>
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="text-6xl mb-4"
                    >
                      💫
                    </motion.div>
                    
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl text-white mb-2"
                    >
                      Game Over
                    </motion.h2>
                    
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-purple-300"
                    >
                      Don't give up! Try again!
                    </motion.p>
                  </>
                )}
              </div>
              
              {/* Stats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="px-8 pb-8"
              >
                <div className="bg-purple-800/30 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      <span className="text-purple-200">Final Score</span>
                    </div>
                    <span className="text-2xl text-white font-mono">
                      {score.toString().padStart(6, '0')}
                    </span>
                  </div>
                  
                  {score > highScore && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: 'spring' }}
                      className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-3 border border-yellow-500/30"
                    >
                      <div className="flex items-center justify-center gap-2 text-yellow-400">
                        <Sparkles className="w-5 h-5" />
                        <span>New High Score!</span>
                        <Sparkles className="w-5 h-5" />
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-purple-500/30">
                    <span className="text-purple-300 text-sm">High Score</span>
                    <span className="text-lg text-purple-200 font-mono">
                      {Math.max(score, highScore).toString().padStart(6, '0')}
                    </span>
                  </div>
                </div>
              </motion.div>
              
              {/* Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="px-8 pb-8 flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayAgain}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/50 transition-shadow"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMainMenu}
                  className="flex-1 bg-purple-700/50 text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-700/70 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Main Menu
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
