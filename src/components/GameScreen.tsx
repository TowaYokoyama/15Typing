import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Crown, PartyPopper, Target, Trophy, XCircle } from "lucide-react";
import { auth, db } from "../firebase"; // ルート構造に合わせて調整
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type Props = {
  onRestart: () => void;
};

type Words = {
  content: string;
  author: string;
};

export default function GameScreen({onRestart}:Props) {
  const totalTime = 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [quote, setQuote] = useState<Words | null>(null); 
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [missFlash, setMissFlash] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [username,setUsername] = useState('ゲスト')
  const [topScores, setTopScores] = useState<{ username: string; score: number; accuracy:number }[]>([]);

  const typeSoundRef = useRef<HTMLAudioElement | null>(null);
  const missSoundRef = useRef<HTMLAudioElement | null>(null);

  const getRandomWord = async (): Promise<Words> => {//自作APIから単語を習得
    const res = await fetch("/words.json"); //静的な単語ファイルを取得
    const data: Record<string, string> = await res.json(); //形式がjsondata
    const keys = Object.keys(data); //stringとしてのキー値だけの配列の作成
    const randomKey = keys[Math.floor(Math.random() * keys.length)]; //randomに作成を行う
    return {
      content: randomKey,
      author: data[randomKey],
    };
  };

  useEffect(() => {
    getRandomWord().then((words) => setQuote(words)); //単語をランダム取得からセットしてあげる
     }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsGameOver(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (!quote) return;
    if (userInput === quote.content) { //入力が現在の単語と一緒やったら
      setScore((prev) => prev + 10);//スコアに10点追加
      getRandomWord().then((words) => setQuote(words)); //次のランダムな奴の取得
      setUserInput("");//入力値をリセットぢて
    }
  }, [userInput, quote]);

  const playTypeSound = () => {
    if (typeSoundRef.current) {
      typeSoundRef.current.currentTime = 0;
      typeSoundRef.current.play();
    }
  };

  const playMissSound = () => {
    if (missSoundRef.current) {
      missSoundRef.current.currentTime = 0;
      missSoundRef.current.play();
    }
    setMissFlash(true);
    setTimeout(() => setMissFlash(false), 200);
  };

  //スコア判定
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (!quote || e.isComposing || e.key === "Process") return;
      if (userInput.length >= quote.content.length) return;
      const expectedChar = quote.content.charAt(userInput.length).toLowerCase(); //現在の期待される1文字
      const inputChar = e.key.toLowerCase(); //実際に押されたキーを小文字に変換

      if (inputChar === expectedChar) {
        playTypeSound();
        setCorrectCount((prev) => prev + 1);
        setUserInput((prev) => prev + e.key);
      } else {
        playMissSound();
        setMissCount((prev) => prev + 1);
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [userInput, quote]);

  const accuracy = correctCount + missCount === 0
    ? 0
    : Math.round((correctCount / (correctCount + missCount)) * 100);

  const finalScore = score + correctCount * 5 - missCount * 2;

  const progressPercent = (timeLeft / totalTime) * 100;

useEffect(() => {
  if (!isGameOver) return;

  const saveAndFetchScores = async () => {
    try {
      // スコアを保存
      await addDoc(collection(db, "scores"), { //FireScoreのスコアズコレクションにデータを保存
        username: username ,
        score: finalScore,
        accuracy,
        correctCount,
        missCount,
        createdAt: serverTimestamp(),
      });

      // 保存後にランキングを取得
      const q = query(
        collection(db, "scores"),
        orderBy("score", "desc"),
        limit(5)
      );
      const querySnapShot = await getDocs(q);
      const scores = querySnapShot.docs.map((doc) => doc.data()) as {
        username: string;
        score: number;
        accuracy: number;
      }[];
      setTopScores(scores);
    } catch (err) {
      console.error("スコア保存または取得エラー", err);
    }
  };

  saveAndFetchScores();
}, [isGameOver]);
  

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // ログイン済み → 表示名 or メールを使う
      setUsername(user.displayName ||  "匿名ユーザー");
    } else {
      // 未ログイン → ゲスト
      setUsername("ゲスト");
    }
  });

  return () => unsubscribe();
}, []);

  return isGameOver ?( 
      <motion.div
        className="flex flex-col items-center justify-center h-screen bg-[#1a1c20] text-white text-center"
       
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold mb-4 flex items-center gap-2 text-">
  <PartyPopper className="w-8 h-8 text-pink-400" />
  結果
</h2>
<h3><Crown />
  </h3>
  <ul className="text-left max-auto w-full max-w-sm">
    {topScores.map((entry, index)=> (
      <li key={index} className="flex justify-between py-1 border-b border-white/10">
        <span className="text-white font-mono">
          {index +1} : {entry.username}
        </span>
        <span className="text-green-300 font-bold">{entry.score}</span>
      </li>
    ))}
  </ul>


<div className="bg-white/10 p-8 rounded-xl border border-white/20 max-w-md w-full">
  <p className="text-xl mb-2 flex items-center gap-2">
    <CheckCircle className="w-5 h-5 text-green-400" />
    正タイプ数: <span className="text-green-400 font-mono">{correctCount}</span>
  </p>
  <p className="text-xl mb-2 flex items-center gap-2">
    <XCircle className="w-5 h-5 text-red-400" />
    誤タイプ数: <span className="text-red-400 font-mono">{missCount}</span>
  </p>
  <p className="text-xl mb-2 flex items-center gap-2">
    <Target className="w-5 h-5 text-yellow-300" />
    精度: <span className="text-yellow-300 font-mono">{accuracy}%</span>
  </p>
  <p className="text-2xl mt-4 font-bold text-green-300 flex items-center gap-2">
    <Trophy className="w-6 h-6 text-green-300" />
    スコア: {finalScore}
  </p>
</div>
        <button
          className="mt-6 px-6 py-2 bg-white text-black rounded-xl shadow hover:bg-gray-200"
          onClick={ onRestart}
        >
          もう一度プレイ
        </button>
      </motion.div>
    ): (
    <div className="flex flex-col h-screen">
      <audio ref={typeSoundRef} src="/type.mp3" preload="auto" />
      <audio ref={missSoundRef} src="/missing.mp3" preload="auto" />

      <header className="p-4 bg-[#1a1c20] text-white">
        <div className="bg-white/10 p-4 rounded-xl shadow-lg backdrop-blur-md max-w-3xl mx-auto w-full text-center border border-white/20">
          <div className="h-6 w-full bg-gray-300 rounded overflow-hidden mb-2">
            <motion.div
              className="h-full bg-green-500"
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "linear", duration: 1 }}
            />
          </div>
          <div className="text-sm text-gray-300">{timeLeft} 秒 残り</div>
        </div>
      </header>

      <main className={`flex flex-col items-center justify-center flex-1 px-4 bg-[#1a1c20] text-white transition`}>
        {quote ? (
          <div className="bg-white/10 p-8 rounded-xl shadow-lg backdrop-blur-md max-w-3xl w-full text-center border border-white/20">
            <div className={`text-3xl md:text-4xl font-mono flex flex-wrap justify-center gap-1 leading-relaxed ${missFlash ? "animate-flash-red" : ""}`}>
              {quote.content.split("").map((char, index) => {
                let colorClass = "text-gray-500";
                if (index < userInput.length) {
                  colorClass = userInput[index] === char ? "text-white" : "text-red-500";
                }
                return (
                  <span key={index} className={`${colorClass}`}>{char}</span>
                );
              })}
            </div>
            <p className="text-md mt-4 text-gray-400">- {quote.author}</p>
            <p className="mt-6 text-xl text-green-300 font-bold">Score: {finalScore}</p>
          </div>
        ) : (
          <p className="text-xl">Loading...</p>
        )}
      </main>
    </div>
  );
}
