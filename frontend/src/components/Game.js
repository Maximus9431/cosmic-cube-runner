import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameEngine from './GameEngine';
import GameUI from './GameUI';
import { gameSettings, mockPowerUps, STORAGE_KEYS } from '../mockData';

const Game = ({ onGameEnd, onBackToMenu }) => {
  // Game state
  const [gameState, setGameState] = useState('playing'); // playing, paused, gameOver
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameSpeed, setGameSpeed] = useState(gameSettings.initialSpeed);
  
  // Player state
  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [currentLane, setCurrentLane] = useState(1); // 0, 1, 2 (left, center, right)
  const [isJumping, setIsJumping] = useState(false);
  
  // Game objects
  const [gameObjects, setGameObjects] = useState({
    obstacles: [],
    coins: [],
    powerUps: []
  });
  
  // Power-ups
  const [activePowerUps, setActivePowerUps] = useState([]);
  const [hasShield, setHasShield] = useState(false);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);
  
  // Game loop
  const gameLoopRef = useRef();
  const lastUpdateRef = useRef(Date.now());
  const distanceTraveledRef = useRef(0);

  // Touch controls
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Initialize game
  useEffect(() => {
    resetGame();
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameState !== 'playing') return;
      
      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          moveRight();
          break;
        case ' ':
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          jump();
          break;
        case 'Escape':
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, currentLane]);

  // Touch controls
  const handleTouchStart = (event) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (!touchStart) return;
    
    const touchEnd = event.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const threshold = 50;

    if (Math.abs(distance) < threshold) {
      // Tap - jump
      jump();
    } else if (distance > threshold) {
      // Swipe left
      moveLeft();
    } else if (distance < -threshold) {
      // Swipe right
      moveRight();
    }
    
    setTouchStart(null);
  };

  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        updateGame();
      }, 16); // ~60 FPS
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState]);

  const resetGame = () => {
    setScore(0);
    setCoins(0);
    setLevel(1);
    setLives(3);
    setGameSpeed(gameSettings.initialSpeed);
    setPlayerPosition([0, 0, 0]);
    setCurrentLane(1);
    setIsJumping(false);
    setGameObjects({ obstacles: [], coins: [], powerUps: [] });
    setActivePowerUps([]);
    setHasShield(false);
    setScoreMultiplier(1);
    setGameState('playing');
    distanceTraveledRef.current = 0;
    lastUpdateRef.current = Date.now();
  };

  const updateGame = () => {
    const now = Date.now();
    const deltaTime = now - lastUpdateRef.current;
    lastUpdateRef.current = now;

    if (gameState !== 'playing') return;

    // Update distance and speed
    distanceTraveledRef.current += gameSpeed * deltaTime;
    const newSpeed = gameSettings.initialSpeed + (distanceTraveledRef.current * gameSettings.speedIncrement);
    setGameSpeed(newSpeed);

    // Update score
    setScore(prev => prev + Math.floor(newSpeed * scoreMultiplier * 100));

    // Update level
    const newLevel = Math.floor(distanceTraveledRef.current / 1000) + 1;
    setLevel(newLevel);

    // Update player position
    updatePlayerPosition();

    // Spawn new objects
    spawnObjects();

    // Update existing objects
    updateObjects(deltaTime);

    // Update power-ups
    updatePowerUps(deltaTime);
  };

  const updatePlayerPosition = () => {
    const lanePositions = [-gameSettings.laneWidth, 0, gameSettings.laneWidth];
    const targetX = lanePositions[currentLane];
    
    setPlayerPosition(prev => {
      const newX = prev[0] + (targetX - prev[0]) * 0.1;
      let newY = prev[1];
      
      // Handle jumping
      if (isJumping) {
        newY = Math.max(0, newY - 0.2);
        if (newY <= 0) {
          setIsJumping(false);
        }
      }
      
      return [newX, newY, prev[2]];
    });
  };

  const spawnObjects = () => {
    const spawnDistance = 50;
    
    setGameObjects(prev => {
      const newObjects = { ...prev };
      
      // Spawn obstacles
      if (Math.random() < gameSettings.obstacleFrequency) {
        const lane = Math.floor(Math.random() * 3);
        const lanePositions = [-gameSettings.laneWidth, 0, gameSettings.laneWidth];
        newObjects.obstacles.push({
          position: [lanePositions[lane], 0, -spawnDistance],
          type: Math.random() < 0.5 ? 'cube' : 'sphere',
          id: Date.now() + Math.random()
        });
      }
      
      // Spawn coins
      if (Math.random() < gameSettings.coinFrequency) {
        const lane = Math.floor(Math.random() * 3);
        const lanePositions = [-gameSettings.laneWidth, 0, gameSettings.laneWidth];
        newObjects.coins.push({
          position: [lanePositions[lane], 1, -spawnDistance],
          collected: false,
          id: Date.now() + Math.random()
        });
      }
      
      // Spawn power-ups
      if (Math.random() < gameSettings.powerUpFrequency) {
        const lane = Math.floor(Math.random() * 3);
        const lanePositions = [-gameSettings.laneWidth, 0, gameSettings.laneWidth];
        const powerUpTypes = ['speed', 'shield', 'multiplier', 'magnet'];
        newObjects.powerUps.push({
          position: [lanePositions[lane], 1, -spawnDistance],
          type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)],
          collected: false,
          id: Date.now() + Math.random()
        });
      }
      
      return newObjects;
    });
  };

  const updateObjects = (deltaTime) => {
    setGameObjects(prev => {
      const speed = gameSpeed * deltaTime;
      
      return {
        obstacles: prev.obstacles
          .map(obj => ({
            ...obj,
            position: [obj.position[0], obj.position[1], obj.position[2] + speed]
          }))
          .filter(obj => obj.position[2] < 10),
        
        coins: prev.coins
          .map(obj => ({
            ...obj,
            position: [obj.position[0], obj.position[1], obj.position[2] + speed]
          }))
          .filter(obj => obj.position[2] < 10),
        
        powerUps: prev.powerUps
          .map(obj => ({
            ...obj,
            position: [obj.position[0], obj.position[1], obj.position[2] + speed]
          }))
          .filter(obj => obj.position[2] < 10)
      };
    });
  };

  const updatePowerUps = (deltaTime) => {
    setActivePowerUps(prev => {
      return prev
        .map(powerUp => ({
          ...powerUp,
          timeLeft: powerUp.timeLeft - deltaTime
        }))
        .filter(powerUp => powerUp.timeLeft > 0);
    });
  };

  // Movement functions
  const moveLeft = () => {
    if (currentLane > 0) {
      setCurrentLane(prev => prev - 1);
    }
  };

  const moveRight = () => {
    if (currentLane < 2) {
      setCurrentLane(prev => prev + 1);
    }
  };

  const jump = () => {
    if (!isJumping) {
      setIsJumping(true);
      setPlayerPosition(prev => [prev[0], 2, prev[2]]);
    }
  };

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  // Collision handlers
  const handleCollision = (index, type) => {
    if (type === 'obstacle') {
      if (hasShield) {
        setHasShield(false);
        setActivePowerUps(prev => prev.filter(p => p.type !== 'shield'));
      } else {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            endGame();
          }
          return newLives;
        });
      }
      
      // Remove the obstacle
      setGameObjects(prev => ({
        ...prev,
        obstacles: prev.obstacles.filter((_, i) => i !== index)
      }));
    }
  };

  const handleCoinCollect = (index) => {
    setCoins(prev => prev + 1);
    setScore(prev => prev + 10 * scoreMultiplier);
    
    setGameObjects(prev => ({
      ...prev,
      coins: prev.coins.map((coin, i) => 
        i === index ? { ...coin, collected: true } : coin
      )
    }));
  };

  const handlePowerUpCollect = (index, type) => {
    const powerUpData = mockPowerUps.find(p => p.id === type) || mockPowerUps[0];
    
    if (type === 'shield') {
      setHasShield(true);
    } else if (type === 'multiplier') {
      setScoreMultiplier(2);
    }
    
    setActivePowerUps(prev => [
      ...prev.filter(p => p.type !== type), // Remove existing of same type
      {
        ...powerUpData,
        type,
        timeLeft: powerUpData.duration
      }
    ]);
    
    setGameObjects(prev => ({
      ...prev,
      powerUps: prev.powerUps.map((powerUp, i) => 
        i === index ? { ...powerUp, collected: true } : powerUp
      )
    }));
  };

  const endGame = () => {
    setGameState('gameOver');
    
    // Save high score
    const currentHighScore = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    if (!currentHighScore || score > parseInt(currentHighScore)) {
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
    }
    
    // Save total coins
    const currentCoins = localStorage.getItem(STORAGE_KEYS.TOTAL_COINS);
    const totalCoins = (currentCoins ? parseInt(currentCoins) : 0) + coins;
    localStorage.setItem(STORAGE_KEYS.TOTAL_COINS, totalCoins.toString());
    
    // Save games played
    const gamesPlayed = localStorage.getItem(STORAGE_KEYS.GAMES_PLAYED);
    const newGamesPlayed = (gamesPlayed ? parseInt(gamesPlayed) : 0) + 1;
    localStorage.setItem(STORAGE_KEYS.GAMES_PLAYED, newGamesPlayed.toString());
    
    onGameEnd?.({ score, coins, level });
  };

  return (
    <div 
      className="w-full h-screen relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      <GameEngine
        gameObjects={gameObjects}
        playerPosition={playerPosition}
        gameSpeed={gameSpeed}
        onCollision={handleCollision}
        onCoinCollect={handleCoinCollect}
        onPowerUpCollect={handlePowerUpCollect}
      />
      
      <GameUI
        gameState={gameState}
        score={score}
        coins={coins}
        level={level}
        lives={lives}
        activePowerUps={activePowerUps}
        onPause={togglePause}
        onResume={() => setGameState('playing')}
        onRestart={resetGame}
        isPaused={gameState === 'paused'}
        isGameOver={gameState === 'gameOver'}
      />
    </div>
  );
};

export default Game;