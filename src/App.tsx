import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { MainMenu } from './components/MainMenu';
import { GameCanvas } from './components/GameCanvas';
import { HUDPanel } from './components/HUDPanel';
import { CharacterSelector } from './components/CharacterSelector';
import { SettingsModal } from './components/SettingsModal';
import { EndScreen } from './components/EndScreen';
import { SoundToggle } from './components/SoundToggle';
import { SoundManager } from './components/SoundManager';

export default function App() {
  const { isGameActive, loadFromStorage } = useGameStore();
  
  useEffect(() => {
    // Load saved data from localStorage
    loadFromStorage();
    
    // Handle game over event
    const handleGameOver = (e: any) => {
      const { victory, score } = e.detail;
      useGameStore.getState().endGame(victory);
    };
    
    window.addEventListener('pixelquest-gameover', handleGameOver);
    
    return () => {
      window.removeEventListener('pixelquest-gameover', handleGameOver);
    };
  }, [loadFromStorage]);
  
  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900">
      {/* Sound Manager */}
      <SoundManager />
      
      {/* Main Menu or Game */}
      {!isGameActive ? (
        <MainMenu />
      ) : (
        <GameCanvas />
      )}
      
      {/* UI Overlays */}
      <HUDPanel />
      <SoundToggle />
      <CharacterSelector />
      <SettingsModal />
      <EndScreen />
    </div>
  );
}
