import { useState } from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";

type GameStatus = "start" | "playing";

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("start");

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
