import { create } from 'zustand';

export interface GameState {
  score: number;
  highScore: number;
  level: number;
  lives: number;
  selectedCharacter: 'lumo' | 'pixy' | 'koza';
  gameMode: 'platformer' | 'endless';
  isGameActive: boolean;
  isGamePaused: boolean;
  isMusicEnabled: boolean;
  isSoundEnabled: boolean;
  musicVolume: number;
  soundVolume: number;
  showCharacterSelector: boolean;
  showSettings: boolean;
  showEndScreen: boolean;
  victory: boolean;
  
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  setLevel: (level: number) => void;
  setLives: (lives: number) => void;
  decrementLives: () => void;
  setSelectedCharacter: (character: 'lumo' | 'pixy' | 'koza') => void;
  setGameMode: (mode: 'platformer' | 'endless') => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (victory: boolean) => void;
  resetGame: () => void;
  toggleMusic: () => void;
  toggleSound: () => void;
  setMusicVolume: (volume: number) => void;
  setSoundVolume: (volume: number) => void;
  toggleCharacterSelector: () => void;
  toggleSettings: () => void;
  closeEndScreen: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  highScore: 0,
  level: 1,
  lives: 3,
  selectedCharacter: 'lumo',
  gameMode: 'platformer',
  isGameActive: false,
  isGamePaused: false,
  isMusicEnabled: true,
  isSoundEnabled: true,
  musicVolume: 0.5,
  soundVolume: 0.7,
  showCharacterSelector: false,
  showSettings: false,
  showEndScreen: false,
  victory: false,
  
  setScore: (score) => {
    set({ score });
    const state = get();
    if (score > state.highScore) {
      set({ highScore: score });
      state.saveToStorage();
    }
  },
  
  addScore: (points) => {
    const state = get();
    const newScore = state.score + points;
    state.setScore(newScore);
  },
  
  setLevel: (level) => set({ level }),
  
  setLives: (lives) => set({ lives }),
  
  decrementLives: () => {
    const state = get();
    const newLives = Math.max(0, state.lives - 1);
    set({ lives: newLives });
    if (newLives === 0) {
      state.endGame(false);
    }
  },
  
  setSelectedCharacter: (character) => {
    set({ selectedCharacter: character });
    get().saveToStorage();
  },
  
  setGameMode: (mode) => set({ gameMode: mode }),
  
  startGame: () => set({ 
    isGameActive: true, 
    isGamePaused: false,
    score: 0,
    lives: 3,
    level: 1,
    showEndScreen: false,
    victory: false
  }),
  
  pauseGame: () => set({ isGamePaused: true }),
  
  resumeGame: () => set({ isGamePaused: false }),
  
  endGame: (victory) => {
    set({ 
      isGameActive: false, 
      isGamePaused: false,
      showEndScreen: true,
      victory
    });
    get().saveToStorage();
  },
  
  resetGame: () => set({ 
    score: 0,
    level: 1,
    lives: 3,
    isGameActive: false,
    isGamePaused: false,
    showEndScreen: false,
    victory: false
  }),
  
  toggleMusic: () => {
    set((state) => ({ isMusicEnabled: !state.isMusicEnabled }));
    get().saveToStorage();
  },
  
  toggleSound: () => {
    set((state) => ({ isSoundEnabled: !state.isSoundEnabled }));
    get().saveToStorage();
  },
  
  setMusicVolume: (volume) => {
    set({ musicVolume: volume });
    get().saveToStorage();
  },
  
  setSoundVolume: (volume) => {
    set({ soundVolume: volume });
    get().saveToStorage();
  },
  
  toggleCharacterSelector: () => set((state) => ({ 
    showCharacterSelector: !state.showCharacterSelector 
  })),
  
  toggleSettings: () => set((state) => ({ 
    showSettings: !state.showSettings 
  })),
  
  closeEndScreen: () => set({ showEndScreen: false }),
  
  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pixelquest-save');
      if (saved) {
        const data = JSON.parse(saved);
        set({
          highScore: data.highScore || 0,
          selectedCharacter: data.selectedCharacter || 'lumo',
          isMusicEnabled: data.isMusicEnabled ?? true,
          isSoundEnabled: data.isSoundEnabled ?? true,
          musicVolume: data.musicVolume ?? 0.5,
          soundVolume: data.soundVolume ?? 0.7,
        });
      }
    }
  },
  
  saveToStorage: () => {
    if (typeof window !== 'undefined') {
      const state = get();
      const saveData = {
        highScore: state.highScore,
        selectedCharacter: state.selectedCharacter,
        isMusicEnabled: state.isMusicEnabled,
        isSoundEnabled: state.isSoundEnabled,
        musicVolume: state.musicVolume,
        soundVolume: state.soundVolume,
      };
      localStorage.setItem('pixelquest-save', JSON.stringify(saveData));
    }
  },
}));
