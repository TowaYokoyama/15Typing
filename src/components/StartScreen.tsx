import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

type Props = {
  onStart: () => void;
};

export default function StartScreen({ onStart }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // ← ユーザー名

  // キー操作でゲームスタート
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        onStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onStart]);

  // サインアップ処理 + 表示名設定
  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user && username.trim()) {
        await updateProfile(user, {
          displayName: username,
        });
        console.log("ユーザー名設定:", username);
      }

      console.log("新規登録完了:", user.uid);
      onStart();
    } catch (err: any) {
      console.error("登録エラー:", err.message);
    }
  };

  // ログイン処理
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("ログイン成功:", userCredential.user.uid);
      onStart();
    } catch (err: any) {
      console.error("ログイン失敗:", err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#1a1c20] text-white">
      <h1 className="text-4xl font-bold text-gray-200">Toefl Words Typing Game</h1>

      <div className="bg-white/10 p-6 rounded-xl shadow-lg w-full max-w-sm border border-white/20">
        <input
          type="text"
          placeholder="ユーザー名"
          className="mb-2 w-full p-2 rounded bg-white/20 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="mb-2 w-full p-2 rounded bg-white/20 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full p-2 rounded bg-white/20 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded mb-2">
          ログイン
        </button>
        <button onClick={handleSignUp} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded mb-2">
          新規登録
        </button>

        <button onClick={onStart} className="w-full text-sm text-gray-300 mt-2 hover:underline">
          ゲストとしてプレイ
        </button>
      </div>
    </div>
  );
}
