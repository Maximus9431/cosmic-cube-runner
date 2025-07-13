import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

const GameUI = ({ 
  gameState, 
  score, 
  coins, 
  level, 
  lives, 
  activePowerUps,
  onPause,
  onResume,
  onRestart,
  isPaused,
  isGameOver
}) => {
  const formatScore = (score) => {
    return score.toLocaleString();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isGameOver) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white">Game Over!</h2>
            <p className="text-gray-300">Your cosmic journey has ended</p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-yellow-400">{formatScore(score)}</p>
                <p className="text-sm text-gray-400">Final Score</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-400">{level}</p>
                <p className="text-sm text-gray-400">Level Reached</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-xl font-bold text-green-400">{coins}</p>
                <p className="text-sm text-gray-400">Coins Collected</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-purple-400">{formatTime(Math.floor(Date.now() / 1000) % 3600)}</p>
                <p className="text-sm text-gray-400">Time Survived</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
            >
              🚀 Play Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              📊 View Leaderboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-40">
        <Card className="p-6 text-center space-y-4 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <h3 className="text-2xl font-bold text-white">Game Paused</h3>
          <div className="space-y-2">
            <Button 
              onClick={onResume}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              ▶️ Resume
            </Button>
            <Button 
              onClick={onRestart}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              🔄 Restart
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="flex justify-between items-start">
          {/* Left side stats */}
          <div className="space-y-2">
            <Card className="p-3 bg-black bg-opacity-60 border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{formatScore(score)}</p>
                  <p className="text-xs text-gray-300">Score</p>
                </div>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-400">{coins}</p>
                  <p className="text-xs text-gray-300">Coins</p>
                </div>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-400">{level}</p>
                  <p className="text-xs text-gray-300">Level</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right side controls */}
          <div className="flex space-x-2">
            <Button 
              size="sm"
              onClick={onPause}
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            >
              ⏸️
            </Button>
          </div>
        </div>
      </div>

      {/* Lives indicator */}
      <div className="absolute top-20 left-4 z-30">
        <Card className="p-2 bg-black bg-opacity-60 border-gray-700">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-300">Lives:</span>
            {Array.from({ length: 3 }, (_, i) => (
              <span 
                key={i} 
                className={`text-lg ${i < lives ? 'text-red-400' : 'text-gray-600'}`}
              >
                ❤️
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Active Power-ups */}
      {activePowerUps.length > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex space-x-2">
            {activePowerUps.map((powerUp, index) => (
              <Card key={index} className="p-2 bg-black bg-opacity-80 border-gray-700">
                <div className="text-center space-y-1">
                  <Badge 
                    style={{ backgroundColor: powerUp.color }}
                    className="text-white text-xs"
                  >
                    {powerUp.name}
                  </Badge>
                  {powerUp.duration > 0 && (
                    <Progress 
                      value={(powerUp.timeLeft / powerUp.duration) * 100}
                      className="w-16 h-1"
                    />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Mobile controls hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 md:hidden">
        <Card className="p-3 bg-black bg-opacity-60 border-gray-700">
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-300">Swipe ⬅️ ➡️ to move</p>
            <p className="text-xs text-gray-400">Tap to jump</p>
          </div>
        </Card>
      </div>

      {/* Level progression */}
      <div className="absolute bottom-4 right-4 z-30">
        <Card className="p-3 bg-black bg-opacity-60 border-gray-700">
          <div className="text-center space-y-1">
            <p className="text-sm text-blue-400 font-semibold">Level {level}</p>
            <Progress 
              value={(score % 200) / 2} 
              className="w-20 h-2"
            />
            <p className="text-xs text-gray-400">Next: {200 - (score % 200)} pts</p>
          </div>
        </Card>
      </div>

      {/* Speed indicator */}
      <div className="absolute bottom-4 left-4 z-30">
        <Card className="p-2 bg-black bg-opacity-60 border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Speed:</span>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-4 rounded ${
                    i < Math.min(5, Math.floor(level / 2) + 1) 
                      ? 'bg-yellow-400' 
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default GameUI;