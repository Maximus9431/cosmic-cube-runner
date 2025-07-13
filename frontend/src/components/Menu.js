import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockScores, mockUser, mockAchievements, STORAGE_KEYS } from '../mockData';

const Menu = ({ onStartGame, onShowLeaderboard }) => {
  const [activeTab, setActiveTab] = useState('play');
  
  // Get stored high score or use mock data
  const getHighScore = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    return stored ? parseInt(stored) : mockUser.highScore;
  };

  const getTotalCoins = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.TOTAL_COINS);
    return stored ? parseInt(stored) : mockUser.totalCoins;
  };

  const getGamesPlayed = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.GAMES_PLAYED);
    return stored ? parseInt(stored) : mockUser.gamesPlayed;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center p-4">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Game Title */}
        <div className="text-center space-y-4">
          <div className="relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              COSMIC
            </h1>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              CUBE RUNNER
            </h2>
          </div>
          <p className="text-gray-300 text-lg">
            Navigate the cosmic void and survive the endless journey
          </p>
        </div>

        {/* Main Menu Card */}
        <Card className="bg-black bg-opacity-60 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="play" className="text-sm">Play</TabsTrigger>
                <TabsTrigger value="stats" className="text-sm">Stats</TabsTrigger>
                <TabsTrigger value="leaderboard" className="text-sm">Ranks</TabsTrigger>
              </TabsList>

              <TabsContent value="play" className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-yellow-400">
                      {getHighScore().toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">Best Score</p>
                  </div>
                  
                  <Button 
                    onClick={onStartGame}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg transform transition-all duration-200 hover:scale-105"
                  >
                    🚀 START JOURNEY
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-green-400">{getTotalCoins()}</p>
                      <p className="text-xs text-gray-400">Total Coins</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-400">{getGamesPlayed()}</p>
                      <p className="text-xs text-gray-400">Games Played</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Your Stats</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-3 bg-gray-800 border-gray-600">
                      <p className="text-lg font-bold text-yellow-400">{getHighScore().toLocaleString()}</p>
                      <p className="text-xs text-gray-400">High Score</p>
                    </Card>
                    
                    <Card className="p-3 bg-gray-800 border-gray-600">
                      <p className="text-lg font-bold text-green-400">{getTotalCoins()}</p>
                      <p className="text-xs text-gray-400">Total Coins</p>
                    </Card>
                    
                    <Card className="p-3 bg-gray-800 border-gray-600">
                      <p className="text-lg font-bold text-blue-400">{getGamesPlayed()}</p>
                      <p className="text-xs text-gray-400">Games Played</p>
                    </Card>
                    
                    <Card className="p-3 bg-gray-800 border-gray-600">
                      <p className="text-lg font-bold text-purple-400">{mockUser.currentLevel}</p>
                      <p className="text-xs text-gray-400">Best Level</p>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-300">Achievements</h4>
                    <div className="space-y-1">
                      {mockAchievements.slice(0, 3).map((achievement) => (
                        <div key={achievement.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{achievement.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-white">{achievement.name}</p>
                              <p className="text-xs text-gray-400">{achievement.description}</p>
                            </div>
                          </div>
                          <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                            {achievement.unlocked ? "✓" : "🔒"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Top Players</h3>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {mockScores.slice(0, 8).map((score, index) => (
                      <div key={score.id} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{score.username}</p>
                            <p className="text-xs text-gray-400">Level {score.level}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-yellow-400">{score.score.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{new Date(score.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={onShowLeaderboard}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    📊 View Full Leaderboard
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Game Controls Info */}
        <Card className="bg-black bg-opacity-40 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-white mb-2">How to Play</h3>
            <div className="space-y-1 text-xs text-gray-300">
              <p>🖱️ Desktop: Use A/D or ← → to move, SPACE to jump</p>
              <p>📱 Mobile: Swipe left/right to move, tap to jump</p>
              <p>🎯 Collect coins and power-ups, avoid red obstacles!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Menu;