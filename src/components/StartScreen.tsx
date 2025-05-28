import { useEffect } from "react";

type Props = {
    onStart: () => void;
};

export default function StartScreen({ onStart}: Props) {
  useEffect(()=> {
    const handlekeyDown = (e:KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "") {
        onStart();
      }
    };

    window.addEventListener("keydown",handlekeyDown);
    return () => window.removeEventListener("keydown",handlekeyDown);
  },[onStart]);


    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#1a1c20]">
      <h1 className="text-4xl text-gray-500 font-bold">Toefl Words typing Game</h1>
      <div className="bg-white/10 p-4 rounded-xl shadow-lg backdrop-blur-md max-w-3xl mx-auto w-full text-center border border-white/20">
      <button
        className=" text-white px-6 py-2 rounded"
        onClick={onStart}
      >
        Enter or SpaceでSTART!
      </button>
      </div>
    </div>
    )
}