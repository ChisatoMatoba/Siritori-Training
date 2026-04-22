import Header from './components/Header.jsx';
import GameBoard from './components/GameBoard.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import { useShiritoriGame } from './hooks/useShiritoriGame.js';
import styles from './App.module.css';

export default function App() {
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

  return (
    <div className={styles.app}>
      <Header />
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
        />
      )}
    </div>
  );
}
