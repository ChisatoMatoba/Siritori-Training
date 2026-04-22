import { useState } from 'react';
import Header from './components/Header.jsx';
import GameBoard from './components/GameBoard.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import TopPage from './components/TopPage.jsx';
import RulesModal from './components/RulesModal.jsx';
import { useShiritoriGame } from './hooks/useShiritoriGame.js';
import styles from './App.module.css';

export default function App() {
  const [screen, setScreen] = useState('top'); // 'top' | 'game'
  const [showRules, setShowRules] = useState(false);

  const {
    words,
    gameOver,
    gameResult,
    error,
    lastChar,
    turnCount,
    submitWord,
    resetGame,
    giveUp,
  } = useShiritoriGame();

  const handleStartGame = () => {
    resetGame();
    setScreen('game');
  };

  const handleBackToTop = () => {
    resetGame();
    setScreen('top');
  };

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
              words={words}
              lastChar={lastChar}
              error={error}
              gameOver={gameOver}
              onSubmit={submitWord}
              onGiveUp={giveUp}
            />
          </main>
          {gameOver && (
            <ResultScreen
              turnCount={turnCount}
              gameResult={gameResult}
              onReset={resetGame}
              onBackToTop={handleBackToTop}
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
