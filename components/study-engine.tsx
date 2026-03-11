"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface StudyEngineProps {
  cards: Flashcard[];
}

export default function StudyEngine({ cards }: StudyEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 max-w-2xl mx-auto py-12">
      <div className="w-full flex justify-between items-center px-4">
        <span className="text-sm font-medium text-slate-500">
          Card {currentIndex + 1} of {cards.length}
        </span>
        <div className="h-1.5 w-48 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative w-full aspect-[16/10] perspective-1000">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full h-full cursor-pointer preserve-3d"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-full h-full w-full h-full preserve-3d"
            >
              {/* Front Side */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl border border-slate-800 bg-slate-900 flex items-center justify-center p-12 text-center text-2xl font-semibold shadow-2xl overflow-y-auto">
                {currentCard.front}
                <div className="absolute bottom-6 text-xs text-slate-500 font-medium uppercase tracking-widest flex items-center gap-2">
                  <RotateCcw size={12} className="animate-pulse" />
                  Click to flip
                </div>
              </div>

              {/* Back Side */}
              <div 
                className="absolute inset-0 w-full h-full backface-hidden rounded-3xl border border-indigo-500/30 bg-indigo-950/20 flex items-center justify-center p-12 text-center text-xl shadow-2xl rotate-y-180 overflow-y-auto"
              >
                {currentCard.back}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-8">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-14 w-14" 
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-14 w-14 border-indigo-500/50 text-indigo-400"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-14 w-14" 
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Tailwind config requires perspective and preserve-3d utilities if not built-in */}
      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
