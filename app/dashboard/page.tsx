"use client";

import { Star, Flame, Trophy, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const mockDecks = [
  { id: "1", title: "Organic Chemistry", count: 42, due: 5 },
  { id: "2", title: "React Patterns", count: 28, due: 0 },
  { id: "3", title: "Spanish verbs", count: 120, due: 12 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter text-indigo-400">
            MEMORIA
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-sm">
              <Flame size={16} />
              7 day streak
            </div>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <section className="flex items-end justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome back, Alex</h1>
            <p className="text-slate-400 text-lg">You have <span className="text-indigo-400 font-semibold">17 cards</span> due for review today.</p>
          </div>
          <Link href="/create">
            <Button size="lg" className="rounded-full px-8 font-bold">
              <Plus className="mr-2 h-5 w-5" />
              New Deck
            </Button>
          </Link>
        </section>

        {/* Decks Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockDecks.map((deck) => (
            <div 
              key={deck.id}
              className="group p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between h-48"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{deck.title}</h3>
                  <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-300">
                    <Settings size={18} />
                  </Button>
                </div>
                <p className="text-slate-500 text-sm font-medium">{deck.count} cards total</p>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                {deck.due > 0 ? (
                   <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                     {deck.due} due today
                   </span>
                ) : (
                   <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-500 text-xs font-bold">
                     All caught up
                   </span>
                )}
                <Link href={`/study/${deck.id}`}>
                  <Button variant="link" className="p-0 h-auto font-bold text-slate-100 hover:text-indigo-400">
                    Study Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Leaderboard Preview */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 space-y-6">
          <div className="flex items-center gap-3">
             <Trophy className="text-indigo-500" size={24} />
             <h2 className="text-2xl font-bold uppercase tracking-widest">Global Leaderboard</h2>
          </div>
          <div className="space-y-3">
             {[
               { rank: 1, name: "Sarah K.", score: 14500, avatar: "👑" },
               { rank: 2, name: "Marcus L.", score: 12200, avatar: "🔥" },
               { rank: 3, name: "Alex (You)", score: 9800, avatar: "⚡" }
             ].map((user) => (
               <div key={user.rank} className={`flex items-center justify-between p-4 rounded-xl ${user.name.includes("You") ? "bg-indigo-500/10 border border-indigo-500/20" : "bg-slate-950/50"}`}>
                 <div className="flex items-center gap-4">
                   <span className="text-slate-500 font-bold w-4">{user.rank}</span>
                   <span className="text-xl">{user.avatar}</span>
                   <span className="font-bold">{user.name}</span>
                 </div>
                 <span className="font-mono text-indigo-400 font-bold">{user.score.toLocaleString()} XP</span>
               </div>
             ))}
          </div>
        </section>
      </main>
    </div>
  );
}
