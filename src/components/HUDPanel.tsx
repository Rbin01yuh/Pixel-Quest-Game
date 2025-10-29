import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const HUDPanel = () => {
  const { score, lives, level, gameMode, isGameActive } = useGameStore();
  const [displayScore, setDisplayScore] = useState(0);
  const [distance, setDistance] = useState(0);
  
  useEffect(() => {
    const handleScore = (e: any) => {
      const newScore = e.detail.score;
      setDisplayScore(newScore);
      useGameStore.getState().setScore(newScore);
      
      if (e.detail.level) {
        useGameStore.getState().setLevel(e.detail.level);
      }
      
      if (e.detail.distance !== undefined) {
        setDistance(e.detail.distance);
      }
    };
    
    const handleLives = (e: any) => {
      useGameStore.getState().setLives(e.detail.lives);
    };
    
    window.addEventListener('pixelquest-score', handleScore);
    window.addEventListener('pixelquest-lives', handleLives);
    
    return () => {
      window.removeEventListener('pixelquest-score', handleScore);
      window.removeEventListener('pixelquest-lives', handleLives);
    };
  }, []);
  
  if (!isGameActive) return null;
  
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none"
    >
      <div className="bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-lg rounded-2xl px-8 py-4 shadow-2xl border-2 border-purple-500/40">
        <div className="flex items-center gap-8">
          {/* Score */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <div>
              <div className="text-xs text-purple-300">Score</div>
              <div className="text-2xl text-white tracking-wider font-mono">
                {displayScore.toString().padStart(6, '0')}
              </div>
            </div>
          </motion.div>
          
          {/* Lives */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div>
              <div className="text-xs text-purple-300">Lives</div>
              <div className="flex gap-1 mt-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        i < lives
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-600 fill-gray-600'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Level or Distance */}
          {gameMode === 'platformer' ? (
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="w-6 h-6 text-cyan-400 fill-cyan-400" />
              <div>
                <div className="text-xs text-purple-300">Level</div>
                <div className="text-2xl text-white tracking-wider font-mono">
                  {level}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="w-6 h-6 text-cyan-400 fill-cyan-400" />
              <div>
                <div className="text-xs text-purple-300">Distance</div>
                <div className="text-xl text-white tracking-wider font-mono">
                  {distance}m
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
