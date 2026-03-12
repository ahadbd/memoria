"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Keyboard } from "lucide-react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface StudyEngineProps {
  cards: Flashcard[];
  currentIndex: number;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function StudyEngine({ cards, currentIndex, isFlipped, onFlip }: StudyEngineProps) {
  const [direction, setDirection] = useState(0);
  const [prevIndex, setPrevIndex] = useState(currentIndex);

  const currentCard = cards[currentIndex];

  useEffect(() => {
    if (currentIndex > prevIndex) setDirection(1);
    else if (currentIndex < prevIndex) setDirection(-1);
    setPrevIndex(currentIndex);
  }, [currentIndex, prevIndex]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="w-full flex justify-between items-center px-2">
        <span className="text-sm font-semibold text-slate-400">
          Card <span className="text-white">{currentIndex + 1}</span> of <span className="text-white">{cards.length}</span>
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <Keyboard size={12} />
            <span>Space to flip · 1-4 to rate</span>
          </div>
          <div className="h-2 w-48 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              initial={false}
              animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="relative w-full aspect-[16/10]" style={{ perspective: "1200px" }}>
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl blur-3xl opacity-20 -z-10"
          animate={{
            background: isFlipped
              ? "radial-gradient(ellipse at center, rgb(99 102 241 / 0.4), transparent 70%)"
              : "radial-gradient(ellipse at center, rgb(139 92 246 / 0.3), transparent 70%)",
          }}
          transition={{ duration: 0.6 }}
        />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 80, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full h-full cursor-pointer"
            onClick={onFlip}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-full h-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-900/80 flex items-center justify-center p-12 text-center text-2xl font-semibold shadow-2xl shadow-black/30 overflow-y-auto"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="space-y-4">
                  <p>{currentCard.front}</p>
                </div>
                <div className="absolute bottom-6 text-xs text-slate-500 font-medium uppercase tracking-widest flex items-center gap-2">
                  <RotateCcw size={12} className="animate-pulse" />
                  Click or press Space to flip
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900 flex items-center justify-center p-12 text-center text-xl shadow-2xl shadow-indigo-500/10 overflow-y-auto"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <p>{currentCard.back}</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
