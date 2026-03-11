"use client";

import { motion } from "framer-motion";
import { Flame, Star, Trophy, Target } from "lucide-react";

export function GamificationOverlay({ streak, xp }: { streak: number, xp: number }) {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40 pointer-events-none">
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-3 px-4 py-2 bg-orange-500 text-white rounded-full shadow-lg shadow-orange-500/20"
      >
        <Flame size={20} className="fill-current" />
        <span className="font-black text-sm tracking-tight">{streak} DAY STREAK</span>
      </motion.div>
      
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 px-4 py-2 bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/20"
      >
        <Trophy size={20} className="fill-current" />
        <span className="font-black text-sm tracking-tight">{xp.toLocaleString()} XP</span>
      </motion.div>
    </div>
  );
}
