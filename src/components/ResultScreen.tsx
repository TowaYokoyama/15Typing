


type Props = {
  onGameEnd: () => void;
};

export default function GameScreen({ onGameEnd }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-2xl">Game In Progress...</h2>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        onClick={onGameEnd}
      >
        End Game
      </button>
    </div>
  );
}
