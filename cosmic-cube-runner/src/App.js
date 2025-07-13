import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Game from "./components/Game";

function App() {
  const [currentView, setCurrentView] = useState('menu'); // menu, game, leaderboard
  const [gameResults, setGameResults] = useState(null);

  const handleStartGame = () => {
    setCurrentView('game');
    setGameResults(null);
  };

  const handleGameEnd = (results) => {
    setGameResults(results);
    setCurrentView('menu');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setGameResults(null);
  };

  const handleShowLeaderboard = () => {
    setCurrentView('leaderboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'game':
        return (
          <Game 
            onGameEnd={handleGameEnd}
            onBackToMenu={handleBackToMenu}
          />
        );
      case 'menu':
      default:
        return (
          <Menu 
            onStartGame={handleStartGame}
            onShowLeaderboard={handleShowLeaderboard}
            gameResults={gameResults}
          />
        );
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={renderCurrentView()} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;