import { useEffect, useState } from "react";

type Quote = {
  content: string;
  author: string;
};

type Props = {
  onGameEnd: () => void;
};

export default function GameScreen({ onGameEnd }: Props) {
  const totalTime = 60; // 秒
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [userInput, setUserInput] = useState(""); //ユーザーが入力したテキスト
  const [score, setScore] = useState(0); // スコア　正しくタイピングできたかどうかのカウント
  const [input,setInput] = useState("");

  const mockQuotes = [
    { content: "The quick brown fox jumps over the lazy dog.", author: "Typing Proverb" },
    { content: "Practice makes perfect.", author: "Anonymous" },
    { content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  ];

  const getMockQuote = () => { //ランダムに1つ名言を選ぶ関数
    const randomIndex = Math.floor(Math.random() * mockQuotes.length); //0以上1未満のランダムな値を取るものをlengthとかけて、小数点以下を切り捨てる
       return mockQuotes[randomIndex]; //配列からランダムに一つ配列を取得
  };

  // 初回レンダリング時に名言取得
  useEffect(() => {
    const quote = getMockQuote();
    setQuote(quote);
  }, []);

  // タイマー
  useEffect(() => {
    if (timeLeft <= 0) {
      onGameEnd();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onGameEnd]);

  // 入力が正しく完了したら次の名言へ
  useEffect(() => {
    if (!quote) return;
    if (userInput === quote.content) {
      setScore((prev) => prev + 1); //スコアを一増やす
      setQuote(getMockQuote()); // 次の名言へ移行
      setUserInput(""); // 入力欄をリセット
    }
  }, [userInput, quote]);

  const progressPercent = (timeLeft / totalTime) * 100;

  const renderQuote = () => {
    if (!quote) return null;

  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="text-2xl bg-gray-800 text-white p-4 text-center font-semibold">
        Typing Game
      </header>

      {/* Main */}
      <main className="flex flex-col items-center justify-center flex-1 p-4 gap-6 bg-black text-white">
        {quote ? (
          <>
            <div className="text-2xl flex flex-wrap justify-center font-mono break-words leading-relaxed">
              {quote.content.split("").map((char, index) => { //名言の 一文字づつの判定
                let color = ""; //  入力済のやつは色をチェック
                if (index < userInput.length) {
                  color = userInput[index] === char ? "text-green-400 animate-pulse" : "text-red-500";
                }
                return (
                  <span key={index} className={`${color}`}>
                    {char}
                  </span>
                );
              })}
            </div>
            <p className="text-sm text-gray-400">- {quote.author}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}

        <input
          type="text"
          value={userInput}
          onChange={(e) => {
            const val = e.target.value;
            if (quote && val.length <= quote.content.length) {
              setUserInput(val); // 入力値をリアルタイムに更新
            }
          }}
          className="border text-white bg-gray-800 rounded px-4 py-2 text-lg w-full max-w-md font-mono"
          placeholder="ここに入力してね"
        />

        <p>Score: {score}</p>
      </main>

      {/* Footer */}
      <footer className="p-2 bg-gray-100">
        <div className="h-4 w-full bg-gray-300 rounded overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="text-center text-sm mt-1 text-gray-700">{timeLeft} 秒 残り</div>
      </footer>
    </div>
  );
}
