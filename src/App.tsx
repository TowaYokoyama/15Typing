import { useState } from "react";
import StartScreen from "./components/StartScreen";


import ResultScreen from "./components/Resultscreen";
import GameScreen from "./components/gameScreen";



type GameStatus = 'start' | 'playing' | 'results';

function App() {
  
  const [gameStatus,setGameStatus] = useState<GameStatus>('start');


  return (
   <>

      {gameStatus === 'start' &&  <StartScreen onStart={()=> setGameStatus('playing')} />}
      {gameStatus === 'playing' &&  <GameScreen onGameEnd={()=> setGameStatus('results')} />}
      {gameStatus === 'results' &&  <ResultScreen onRestart={()=> setGameStatus('start')} />}

        </>
  )};

export default App
