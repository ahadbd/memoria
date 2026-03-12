"use client";

import { useState, useEffect, useCallback } from "react";
import { fsrs, ratings } from "@/lib/fsrs";
import { Rating, Card as FSRSCard, createEmptyCard } from "ts-fsrs";
import StudyEngine from "./study-engine";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, BarChart3, Target, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: number;
  lastReview: Date | null;
  nextReview: Date;
}

export interface ReviewResult {
  cardId: string;
  rating: number;
  nextState: {
    stability: number;
    difficulty: number;
    elapsedDays: number;
    scheduledDays: number;
    reps: number;
    lapses: number;
    state: number;
    lastReview: Date;
    nextReview: Date;
  };
}

interface StudySessionProps {
  cards: Flashcard[];
  onSessionComplete: (results: ReviewResult[]) => void;
}

export default function StudySession({ cards, onSessionComplete }: StudySessionProps) {
  const [sessionCards] = useState(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  // Timer
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleRating = useCallback((rating: Rating) => {
    const currentCard = sessionCards[currentIndex];

    const fsrsCard: FSRSCard = {
      ...createEmptyCard(currentCard.lastReview ? new Date(currentCard.lastReview) : new Date()),
      stability: currentCard.stability,
      difficulty: currentCard.difficulty,
      elapsed_days: currentCard.elapsedDays,
      scheduled_days: currentCard.scheduledDays,
      reps: currentCard.reps,
      lapses: currentCard.lapses,
      state: currentCard.state,
      last_review: currentCard.lastReview ? new Date(currentCard.lastReview) : undefined,
    };

    const scheduledCards = fsrs.repeat(fsrsCard, new Date());
    const nextCardState = (scheduledCards as any)[rating].card;

    const result: ReviewResult = {
      cardId: currentCard.id,
      rating: rating,
      nextState: {
        stability: nextCardState.stability,
        difficulty: nextCardState.difficulty,
        elapsedDays: nextCardState.elapsed_days,
        scheduledDays: nextCardState.scheduled_days,
        reps: nextCardState.reps,
        lapses: nextCardState.lapses,
        state: nextCardState.state,
        lastReview: new Date(),
        nextReview: (scheduledCards as any)[rating].card.due,
      }
    };

    const newResults = [...results, result];
    setResults(newResults);
    setIsFlipped(false);

    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
      onSessionComplete(newResults);
    }
  }, [currentIndex, sessionCards, results, onSessionComplete, isFlipped]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped(f => !f);
      }
      if (e.key === "1") handleRating(1 as Rating);
      if (e.key === "2") handleRating(2 as Rating);
      if (e.key === "3") handleRating(3 as Rating);
      if (e.key === "4") handleRating(4 as Rating);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRating, isFinished]);

  if (isFinished) {
    const avgRating = results.reduce((a, r) => a + r.rating, 0) / results.length;
    const easyCount = results.filter(r => r.rating === 4).length;
    const goodCount = results.filter(r => r.rating === 3).length;
    const hardCount = results.filter(r => r.rating === 2).length;
    const againCount = results.filter(r => r.rating === 1).length;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center space-y-8 py-16"
      >
        {/* Confetti-like particles */}
        <div className="relative">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{
                background: ["#818cf8", "#a78bfa", "#f472b6", "#34d399", "#fbbf24"][i % 5],
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i / 12) * Math.PI * 2) * 120,
                y: Math.sin((i / 12) * Math.PI * 2) * 120,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 1.5, delay: i * 0.05, ease: "easeOut" }}
            />
          ))}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40"
          >
            <Trophy size={48} className="text-white" />
          </motion.div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight">Session Complete!</h2>
          <p className="text-slate-400">You reviewed <span className="text-indigo-400 font-bold">{cards.length} cards</span> in <span className="text-white font-bold">{formatTime(elapsed)}</span></p>
        </div>

        {/* Stats Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl">
          {[
            { label: "Easy", count: easyCount, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Good", count: goodCount, color: "text-sky-400", bg: "bg-sky-500/10" },
            { label: "Hard", count: hardCount, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Again", count: againCount, color: "text-rose-400", bg: "bg-rose-500/10" },
          ].map(item => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${item.bg} rounded-xl p-4 text-center`}
            >
              <p className={`text-2xl font-black ${item.color}`}>{item.count}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button size="lg" variant="outline" className="px-8 font-bold" onClick={() => window.location.reload()}>
            Study Again
          </Button>
          <Button size="lg" className="px-8 font-bold bg-indigo-600 hover:bg-indigo-500" onClick={() => window.location.href = "/dashboard"}>
            Dashboard
          </Button>
        </div>
      </motion.div>
    );
  }

  const ratingColors: Record<string, string> = {
    "Again": "border-rose-500/40 hover:bg-rose-500/20 hover:border-rose-500/60",
    "Hard": "border-amber-500/40 hover:bg-amber-500/20 hover:border-amber-500/60",
    "Good": "border-sky-500/40 hover:bg-sky-500/20 hover:border-sky-500/60",
    "Easy": "border-emerald-500/40 hover:bg-emerald-500/20 hover:border-emerald-500/60",
  };

  return (
    <div className="space-y-8">
      {/* Live Stats Bar */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-slate-500">
          <Target size={14} className="text-indigo-400" />
          <span><span className="text-white font-bold">{results.length}</span> reviewed</span>
        </div>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center gap-2 text-slate-500">
          <BarChart3 size={14} className="text-violet-400" />
          <span>Avg: <span className="text-white font-bold">{results.length > 0 ? (results.reduce((a, r) => a + r.rating, 0) / results.length).toFixed(1) : "—"}</span></span>
        </div>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center gap-2 text-slate-500">
          <Clock size={14} className="text-cyan-400" />
          <span className="text-white font-bold">{formatTime(elapsed)}</span>
        </div>
      </div>

      <StudyEngine
        cards={sessionCards}
        currentIndex={currentIndex}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(f => !f)}
      />

      {/* Rating Buttons */}
      <div className="max-w-xl mx-auto grid grid-cols-4 gap-3 px-4 pb-12">
        {ratings.map((rating, i) => (
          <Button
            key={rating.value}
            variant="outline"
            className={`flex flex-col items-center gap-1 h-20 bg-slate-900/50 transition-all hover:scale-105 active:scale-95 ${ratingColors[rating.label] || 'border-slate-800'}`}
            onClick={() => handleRating(rating.value as Rating)}
          >
            <span className="text-lg">{["😓", "😐", "😊", "🤩"][i]}</span>
            <span className={`text-xs font-bold uppercase ${rating.color}`}>{rating.label}</span>
            <span className="text-[10px] text-slate-600 font-medium">Press {i + 1}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
