import React from 'react';
import './App.css';
import * as Game from './game/gameRunner'

Game.setupGame();

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>
        Lizards
      </h1>
      <div id="game-container" />
      <a href="https://github.com/RichTeaMan/Lizards" target="_blank" rel="noreferrer noopener">Source Code</a>
    </div>
  );
}

export default App;
