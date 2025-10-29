import { motion } from 'motion/react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const SoundToggle = () => {
  const { isMusicEnabled, isSoundEnabled, toggleMusic, toggleSound, isGameActive } = useGameStore();
  
  if (!isGameActive) return null;
  
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed top-4 right-4 z-40 flex gap-2"
    >
      {/* Music Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
        className={`w-12 h-12 rounded-full backdrop-blur-md shadow-lg transition-all ${
          isMusicEnabled
            ? 'bg-gradient-to-br from-pink-500/80 to-purple-500/80 shadow-pink-500/50'
            : 'bg-gray-800/80'
        }`}
      >
        <Music className={`w-5 h-5 mx-auto ${isMusicEnabled ? 'text-white' : 'text-gray-400'}`} />
      </motion.button>
      
      {/* Sound Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSound}
        className={`w-12 h-12 rounded-full backdrop-blur-md shadow-lg transition-all ${
          isSoundEnabled
            ? 'bg-gradient-to-br from-cyan-500/80 to-blue-500/80 shadow-cyan-500/50'
            : 'bg-gray-800/80'
        }`}
      >
        {isSoundEnabled ? (
          <Volume2 className="w-5 h-5 text-white mx-auto" />
        ) : (
          <VolumeX className="w-5 h-5 text-gray-400 mx-auto" />
        )}
      </motion.button>
    </motion.div>
  );
};
