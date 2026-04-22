import { useState } from 'react';
import Header from './components/Header.jsx';
import GameBoard from './components/GameBoard.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import TopPage from './components/TopPage.jsx';
import RulesModal from './components/RulesModal.jsx';
import { useShiritoriGame } from './hooks/useShiritoriGame.js';
import { useTimeAttackGame } from './hooks/useTimeAttackGame.js';
import { useConstraintGame } from './hooks/useConstraintGame.js';
import { findMeanComputerWord } from './utils/shiritori.js';
import styles from './App.module.css';

export default function App() {
  const [screen, setScreen] = useState('top'); // 'top' | 'game'
  const [mode, setMode] = useState('normal'); // 'normal' | 'time-attack' | 'mean' | 'constraint'
  const [showRules, setShowRules] = useState(false);

  const normalGame = useShiritoriGame();
  const meanGame = useShiritoriGame({ wordFinder: findMeanComputerWord });
  const timeAttackGame = useTimeAttackGame();
  const constraintGame = useConstraintGame();

  function getGame() {
    if (mode === 'time-attack') return timeAttackGame;
    if (mode === 'mean') return meanGame;
    if (mode === 'constraint') return constraintGame;
    return normalGame;
  }
  const game = getGame();

  const handleStartGame = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === 'time-attack') {
      timeAttackGame.resetGame();
    } else if (selectedMode === 'mean') {
      meanGame.resetGame();
    } else if (selectedMode === 'constraint') {
      constraintGame.resetGame();
    } else {
      normalGame.resetGame();
    }
    setScreen('game');
  };

  const handleBackToTop = () => {
    game.resetGame();
    setScreen('top');
  };

  const timer = mode === 'time-attack' ? {
    timeLeft: timeAttackGame.timeLeft,
    timeLimit: timeAttackGame.timeLimit,
    started: timeAttackGame.started,
  } : null;

  return (
    <div className={styles.app}>
      {screen === 'top' ? (
        <>
          <Header />
          <main className={styles.main}>
            <TopPage
              onStartGame={handleStartGame}
              onShowRules={() => setShowRules(true)}
            />
          </main>
        </>
      ) : (
        <>
          <Header onBack={handleBackToTop} onShowRules={() => setShowRules(true)} />
          <main className={styles.main}>
            <GameBoard
              words={game.words}
              lastChar={game.lastChar}
              error={game.error}
              gameOver={game.gameOver}
              onSubmit={game.submitWord}
              onGiveUp={mode !== 'time-attack' ? game.giveUp : null}
              timer={timer}
              constraint={mode === 'constraint' ? game.constraint : null}
            />
          </main>
          {game.gameOver && (
            <ResultScreen
              turnCount={game.turnCount}
              gameResult={game.gameResult}
              onReset={game.resetGame}
              onBackToTop={handleBackToTop}
              mode={mode}
            />
          )}
        </>
      )}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      <footer className={styles.footer}>
        Dictionary data from{' '}
        <a href="https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project" target="_blank" rel="noopener noreferrer">JMdict</a>
        {' '}by{' '}
        <a href="https://www.edrdg.org/" target="_blank" rel="noopener noreferrer">EDRDG</a>
        {' '}(CC BY-SA 4.0)
      </footer>
    </div>
  );
}
