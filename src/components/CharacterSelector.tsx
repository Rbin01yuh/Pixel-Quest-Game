import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Bird, ShieldCheck } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const characters = [
  {
    id: 'lumo' as const,
    name: 'Lumo',
    description: 'A glowing creature with balanced abilities',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500',
    stats: { speed: 8, jump: 8, defense: 6 }
  },
  {
    id: 'pixy' as const,
    name: 'Pixy',
    description: 'A flying bird with enhanced speed and jump',
    icon: Bird,
    color: 'from-orange-500 to-yellow-500',
    stats: { speed: 10, jump: 10, defense: 4 }
  },
  {
    id: 'koza' as const,
    name: 'Koza',
    description: 'A tanky turtle with high defense',
    icon: ShieldCheck,
    color: 'from-green-500 to-emerald-500',
    stats: { speed: 5, jump: 6, defense: 10 }
  }
];

export const CharacterSelector = () => {
  const { showCharacterSelector, toggleCharacterSelector, selectedCharacter, setSelectedCharacter } = useGameStore();
  
  const handleSelect = (characterId: 'lumo' | 'pixy' | 'koza') => {
    setSelectedCharacter(characterId);
    toggleCharacterSelector();
  };
  
  return (
    <AnimatePresence>
      {showCharacterSelector && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCharacterSelector}
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
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl shadow-2xl max-w-4xl w-full border-2 border-purple-500/30 overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-purple-500/30">
                <h2 className="text-3xl text-center text-white mb-2">
                  Choose Your Character
                </h2>
                <p className="text-center text-purple-300 text-sm">
                  Each character has unique abilities
                </p>
                <button
                  onClick={toggleCharacterSelector}
                  className="absolute top-6 right-6 text-purple-300 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Characters */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {characters.map((character, index) => {
                  const Icon = character.icon;
                  const isSelected = selectedCharacter === character.id;
                  
                  return (
                    <motion.button
                      key={character.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelect(character.id)}
                      className={`relative rounded-2xl p-6 transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br ' + character.color + ' shadow-lg shadow-purple-500/50'
                          : 'bg-purple-800/30 hover:bg-purple-800/50'
                      }`}
                    >
                      {/* Selected indicator */}
                      {isSelected && (
                        <motion.div
                          layoutId="selected-character"
                          className="absolute inset-0 border-4 border-white rounded-2xl"
                          transition={{ type: 'spring', damping: 20 }}
                        />
                      )}
                      
                      <div className="relative z-10">
                        {/* Icon */}
                        <motion.div
                          animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                          className="flex justify-center mb-4"
                        >
                          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center shadow-lg`}>
                            <Icon className="w-10 h-10 text-white" />
                          </div>
                        </motion.div>
                        
                        {/* Name */}
                        <h3 className="text-xl text-white text-center mb-2">
                          {character.name}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-sm text-purple-200 text-center mb-4">
                          {character.description}
                        </p>
                        
                        {/* Stats */}
                        <div className="space-y-2">
                          {Object.entries(character.stats).map(([stat, value]) => (
                            <div key={stat}>
                              <div className="flex justify-between text-xs text-purple-200 mb-1">
                                <span className="capitalize">{stat}</span>
                                <span>{value}/10</span>
                              </div>
                              <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${value * 10}%` }}
                                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                                  className={`h-full bg-gradient-to-r ${character.color} rounded-full`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-purple-500/30 text-center">
                <p className="text-sm text-purple-300">
                  Selected: <span className="text-white">{characters.find(c => c.id === selectedCharacter)?.name}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
