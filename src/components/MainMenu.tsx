import { motion } from 'motion/react';
import { Play, Infinity, Users, Settings, Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const MainMenu = () => {
  const { 
    startGame, 
    setGameMode, 
    toggleCharacterSelector, 
    toggleSettings,
    highScore,
    selectedCharacter 
  } = useGameStore();
  
  const handleStartPlatformer = () => {
    setGameMode('platformer');
    startGame();
  };
  
  const handleStartEndless = () => {
    setGameMode('endless');
    startGame();
  };
  
  const characters = {
    lumo: { name: 'Lumo', emoji: '💫' },
    pixy: { name: 'Pixy', emoji: '🐦' },
    koza: { name: 'Koza', emoji: '🐢' }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-2xl w-full">
        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="mb-4"
          >
            <h1 className="text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2 drop-shadow-lg">
              PixelQuest
            </h1>
            <p className="text-2xl md:text-3xl text-purple-300 drop-shadow-md">
              Odyssey of Lumo
            </p>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-purple-300 text-sm"
          >
            Created by Ridho Bintang Aulia
          </motion.p>
        </motion.div>
        
        {/* High Score */}
        {highScore > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-purple-500/30"
          >
            <div className="flex items-center justify-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-purple-300">High Score:</span>
              <span className="text-2xl text-white font-mono">
                {highScore.toString().padStart(6, '0')}
              </span>
            </div>
          </motion.div>
        )}
        
        {/* Game Mode Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.button
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartPlatformer}
            className="bg-gradient-to-br from-cyan-500 to-blue-500 p-8 rounded-2xl shadow-lg hover:shadow-cyan-500/50 transition-all group"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
              >
                <Play className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl text-white">Story Mode</h3>
              <p className="text-sm text-cyan-100">
                Complete 3 challenging levels
              </p>
            </div>
          </motion.button>
          
          <motion.button
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartEndless}
            className="bg-gradient-to-br from-pink-500 to-purple-500 p-8 rounded-2xl shadow-lg hover:shadow-pink-500/50 transition-all group"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
              >
                <Infinity className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl text-white">Endless Run</h3>
              <p className="text-sm text-pink-100">
                See how far you can go!
              </p>
            </div>
          </motion.button>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleCharacterSelector}
            className="bg-purple-800/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30 hover:bg-purple-800/70 transition-all group"
          >
            <div className="flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-purple-300 group-hover:text-white transition-colors" />
              <span className="text-white text-sm">Characters</span>
              <span className="text-xs text-purple-300">
                {characters[selectedCharacter].emoji} {characters[selectedCharacter].name}
              </span>
            </div>
          </motion.button>
          
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSettings}
            className="bg-purple-800/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30 hover:bg-purple-800/70 transition-all group"
          >
            <div className="flex flex-col items-center gap-2">
              <Settings className="w-6 h-6 text-purple-300 group-hover:text-white transition-colors" />
              <span className="text-white text-sm">Settings</span>
              <span className="text-xs text-purple-300">Audio & Controls</span>
            </div>
          </motion.button>
        </div>
        
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
        >
          <h4 className="text-white mb-3 text-center">How to Play</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-purple-700/30 rounded-lg p-3 text-center">
              <div className="text-white mb-1">←→</div>
              <div className="text-purple-300">Move</div>
            </div>
            <div className="bg-purple-700/30 rounded-lg p-3 text-center">
              <div className="text-white mb-1">↑</div>
              <div className="text-purple-300">Jump</div>
            </div>
            <div className="bg-purple-700/30 rounded-lg p-3 text-center">
              <div className="text-white mb-1">SPACE</div>
              <div className="text-purple-300">Shoot</div>
            </div>
            <div className="bg-purple-700/30 rounded-lg p-3 text-center">
              <div className="text-white mb-1">ESC</div>
              <div className="text-purple-300">Pause</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
