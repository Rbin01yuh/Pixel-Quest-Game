import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../game/scenes/MainScene';
import { EndlessScene } from '../game/scenes/EndlessScene';
import { useGameStore } from '../store/gameStore';

export const GameCanvas = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { selectedCharacter, gameMode, isGameActive, isGamePaused } = useGameStore();
  
  useEffect(() => {
    if (!isGameActive || gameRef.current) return;
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      backgroundColor: '#240046',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 600, x: 0 },
          debug: false
        }
      },
      scene: gameMode === 'platformer' ? MainScene : EndlessScene,
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };
    
    gameRef.current = new Phaser.Game(config);
    
    // Pass character data to scene
    gameRef.current.scene.start(
      gameMode === 'platformer' ? 'MainScene' : 'EndlessScene',
      { character: selectedCharacter }
    );
    
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [isGameActive, selectedCharacter, gameMode]);
  
  useEffect(() => {
    if (!gameRef.current) return;
    
    const scene = gameRef.current.scene.getScene(
      gameMode === 'platformer' ? 'MainScene' : 'EndlessScene'
    );
    
    if (scene) {
      if (isGamePaused) {
        scene.scene.pause();
      } else {
        scene.scene.resume();
      }
    }
  }, [isGamePaused, gameMode]);
  
  if (!isGameActive) return null;
  
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-900">
      <div 
        id="game-container" 
        className="relative rounded-lg overflow-hidden shadow-2xl"
        style={{
          maxWidth: '800px',
          maxHeight: '600px',
          aspectRatio: '4/3'
        }}
      />
    </div>
  );
};
