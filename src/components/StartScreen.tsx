

type Props = {
    onStart: () => void;
};

export default function StartScreen({ onStart}: Props) {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">Typing Game</h1>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
        onClick={onStart}
      >
        Start Game
      </button>
    </div>
    )
}