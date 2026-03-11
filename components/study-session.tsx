"use client";

import { useState } from "react";
import { fsrs, ratings } from "@/lib/fsrs";
import { Rating, Card as FSRSCard } from "ts-fsrs";
import StudyEngine from "./study-engine";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy } from "lucide-react";
import { motion } from "framer-motion";

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

interface StudySessionProps {
  cards: Flashcard[];
  onSessionComplete: (results: any[]) => void;
}

export default function StudySession({ cards, onSessionComplete }: StudySessionProps) {
  const [sessionCards, setSessionCards] = useState(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleRating = (rating: Rating) => {
    const currentCard = sessionCards[currentIndex];
    
    // Map database card to FSRS card
    const fsrsCard: FSRSCard = {
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
    const nextCardState = scheduledCards[rating].card;

    const result = {
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
        nextReview: scheduledCards[rating].card.due,
      }
    };

    const newResults = [...results, result];
    setResults(newResults);

    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
      onSessionComplete(newResults);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 py-20">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="h-24 w-24 rounded-full bg-indigo-500 flex items-center justify-center text-white"
        >
          <Trophy size={48} />
        </motion.div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Session Complete!</h2>
          <p className="text-slate-400">You've studied {cards.length} cards today.</p>
        </div>
        <Button size="lg" className="px-12 font-bold" onClick={() => window.location.href = "/dashboard"}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <StudyEngine cards={sessionCards} />

      <div className="max-w-xl mx-auto grid grid-cols-4 gap-4 px-4 pb-20">
        {ratings.map((rating) => (
          <Button
            key={rating.value}
            variant="outline"
            className="flex flex-col items-center gap-1 h-16 border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all hover:scale-105"
            onClick={() => handleRating(rating.value as Rating)}
          >
            <span className={`text-xs font-bold uppercase ${rating.color}`}>{rating.label}</span>
            <span className="text-[10px] text-slate-500 font-medium">Rate {rating.label.toLowerCase()}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
