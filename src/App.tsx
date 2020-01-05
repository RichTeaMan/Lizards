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
      <section className="container">
        <div className="one"><div id="game-container" /></div>
        <div className="two">
          <h2>Controls:</h2>
          <p>
            Aim with the mouse and shoot with the space bar. Move lizards with the arrow keys.
          </p>
          <p>
            Mouse wheel to zoom. Pan around the map by dragging with the middle mouse button.
          </p>
        </div>
      </section>

      <a href="https://github.com/RichTeaMan/Lizards" target="_blank" rel="noreferrer noopener">Source Code</a>
    </div>
  );
}

export default App;
