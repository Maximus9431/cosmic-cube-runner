// Mock data for the Cosmic Cube Runner game

export const mockScores = [
  {
    id: 1,
    username: "CosmicRunner",
    score: 2350,
    timestamp: new Date('2025-01-15T10:30:00Z'),
    level: 15
  },
  {
    id: 2,
    username: "StarJumper",
    score: 1890,
    timestamp: new Date('2025-01-15T09:15:00Z'),
    level: 12
  },
  {
    id: 3,
    username: "Cubemaster",
    score: 1650,
    timestamp: new Date('2025-01-15T08:45:00Z'),
    level: 11
  },
  {
    id: 4,
    username: "SpaceRunner",
    score: 1420,
    timestamp: new Date('2025-01-14T22:30:00Z'),
    level: 9
  },
  {
    id: 5,
    username: "GalaxyHopper",
    score: 1200,
    timestamp: new Date('2025-01-14T21:15:00Z'),
    level: 8
  },
  {
    id: 6,
    username: "NeonDasher",
    score: 980,
    timestamp: new Date('2025-01-14T20:00:00Z'),
    level: 7
  },
  {
    id: 7,
    username: "VoidRunner",
    score: 750,
    timestamp: new Date('2025-01-14T19:30:00Z'),
    level: 6
  },
  {
    id: 8,
    username: "CyberCube",
    score: 620,
    timestamp: new Date('2025-01-14T18:45:00Z'),
    level: 5
  }
];

export const mockPowerUps = [
  {
    id: 'speed_boost',
    name: 'Speed Boost',
    description: 'Increases speed for 10 seconds',
    color: '#ff6b35',
    duration: 10000
  },
  {
    id: 'score_multiplier',
    name: 'Score x2',
    description: 'Doubles score for 15 seconds',
    color: '#f7931e',
    duration: 15000
  },
  {
    id: 'shield',
    name: 'Shield',
    description: 'Protects from one collision',
    color: '#00d4ff',
    duration: 0
  },
  {
    id: 'coin_magnet',
    name: 'Coin Magnet',
    description: 'Attracts nearby coins',
    color: '#00ff88',
    duration: 12000
  }
];

export const mockAchievements = [
  {
    id: 'first_run',
    name: 'First Steps',
    description: 'Complete your first run',
    unlocked: true,
    icon: '🚀'
  },
  {
    id: 'score_1000',
    name: 'Rookie Runner',
    description: 'Score 1000 points',
    unlocked: true,
    icon: '⭐'
  },
  {
    id: 'score_2000',
    name: 'Space Explorer',
    description: 'Score 2000 points',
    unlocked: false,
    icon: '🌟'
  },
  {
    id: 'collect_100_coins',
    name: 'Coin Collector',
    description: 'Collect 100 coins total',
    unlocked: false,
    icon: '💰'
  },
  {
    id: 'level_10',
    name: 'Cosmic Voyager',
    description: 'Reach level 10',
    unlocked: false,
    icon: '🚀'
  }
];

// Game settings
export const gameSettings = {
  initialSpeed: 0.1,
  speedIncrement: 0.002,
  laneWidth: 3,
  numberOfLanes: 3,
  obstacleFrequency: 0.02,
  coinFrequency: 0.015,
  powerUpFrequency: 0.005,
  viewDistance: 100,
  fogDistance: 150
};

// Local storage keys
export const STORAGE_KEYS = {
  HIGH_SCORE: 'cosmic_cube_high_score',
  TOTAL_COINS: 'cosmic_cube_total_coins',
  GAMES_PLAYED: 'cosmic_cube_games_played',
  ACHIEVEMENTS: 'cosmic_cube_achievements',
  SETTINGS: 'cosmic_cube_settings'
};

// Mock user data
export const mockUser = {
  id: 'user_123',
  username: 'PlayerOne',
  avatar: '🎮',
  gamesPlayed: 45,
  totalCoins: 1250,
  highScore: 1890,
  currentLevel: 12,
  totalPlayTime: 7200000 // in milliseconds
};