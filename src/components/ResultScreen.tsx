

type Props = {
  onRestart: () => void;
};

export default function ResultScreen({ onRestart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-2xl">Game Over!</h2>
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        onClick={onRestart}
      >
        Retry
      </button>
    </div>
  );
}

