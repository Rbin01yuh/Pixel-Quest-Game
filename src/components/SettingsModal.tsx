import { motion, AnimatePresence } from 'motion/react';
import { X, Music, Volume2, Settings as SettingsIcon } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';

export const SettingsModal = () => {
  const {
    showSettings,
    toggleSettings,
    isMusicEnabled,
    isSoundEnabled,
    musicVolume,
    soundVolume,
    toggleMusic,
    toggleSound,
    setMusicVolume,
    setSoundVolume
  } = useGameStore();
  
  return (
    <AnimatePresence>
      {showSettings && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSettings}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl shadow-2xl max-w-md w-full border-2 border-purple-500/30 overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-purple-500/30">
                <div className="flex items-center justify-center gap-3">
                  <SettingsIcon className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl text-white">
                    Settings
                  </h2>
                </div>
                <button
                  onClick={toggleSettings}
                  className="absolute top-6 right-6 text-purple-300 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Music Settings */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white">Music</h3>
                        <p className="text-xs text-purple-300">Background music</p>
                      </div>
                    </div>
                    <Switch
                      checked={isMusicEnabled}
                      onCheckedChange={toggleMusic}
                    />
                  </div>
                  
                  {isMusicEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-13"
                    >
                      <div className="flex items-center gap-3">
                        <Slider
                          value={[musicVolume * 100]}
                          onValueChange={(value) => setMusicVolume(value[0] / 100)}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm text-purple-300 w-12 text-right">
                          {Math.round(musicVolume * 100)}%
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Sound Effects Settings */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white">Sound Effects</h3>
                        <p className="text-xs text-purple-300">Game sounds</p>
                      </div>
                    </div>
                    <Switch
                      checked={isSoundEnabled}
                      onCheckedChange={toggleSound}
                    />
                  </div>
                  
                  {isSoundEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-13"
                    >
                      <div className="flex items-center gap-3">
                        <Slider
                          value={[soundVolume * 100]}
                          onValueChange={(value) => setSoundVolume(value[0] / 100)}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm text-purple-300 w-12 text-right">
                          {Math.round(soundVolume * 100)}%
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 border-t border-purple-500/30"
                >
                  <div className="text-center text-sm text-purple-300 space-y-2">
                    <p>Controls:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-purple-800/30 rounded-lg p-2">
                        <span className="text-white">Arrow Keys</span> - Move
                      </div>
                      <div className="bg-purple-800/30 rounded-lg p-2">
                        <span className="text-white">Up Arrow</span> - Jump
                      </div>
                      <div className="bg-purple-800/30 rounded-lg p-2">
                        <span className="text-white">Space</span> - Shoot
                      </div>
                      <div className="bg-purple-800/30 rounded-lg p-2">
                        <span className="text-white">ESC</span> - Pause
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
