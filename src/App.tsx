import { useState } from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";

type GameStatus = "start" | "playing";

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("start"); //state管理で、ゲーム状態を把握

  return (
    <>
      {gameStatus === "start" && (
        <StartScreen onStart={() => setGameStatus("playing")} />
      )}

      {gameStatus === "playing" && (
        <GameScreen onRestart={() => setGameStatus("start")} />
      )}
    </>
  );
}

export default App;
