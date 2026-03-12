import { Flame, Trophy, Plus, BookOpen, Layers, Clock, Zap, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { syncUser } from "@/lib/actions";
import DeckGrid from "@/components/deck-grid";

export default async function Dashboard() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }

  let dbUser = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      decks: {
        include: {
          _count: {
            select: { cards: true }
          },
          cards: {
            select: {
              id: true,
              nextReview: true,
              reps: true,
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      },
      _count: {
        select: { reviews: true }
      }
    }
  });

  if (!dbUser) {
    dbUser = await syncUser() as any;
    if (!dbUser) redirect("/sign-in");
  }

  const totalCards = dbUser.decks.reduce((acc, d) => acc + d._count.cards, 0);
  const totalDue = dbUser.decks.reduce((acc, d) => acc + d.cards.filter((c: any) => new Date(c.nextReview) <= new Date()).length, 0);

  const decks = dbUser.decks.map(deck => {
    const dueCards = deck.cards.filter((c: any) => new Date(c.nextReview) <= new Date()).length;
    const reviewedCards = deck.cards.filter((c: any) => c.reps > 0).length;
    const mastery = deck._count.cards > 0 ? Math.round((reviewedCards / deck._count.cards) * 100) : 0;
    return {
      id: deck.id,
      title: deck.title,
      count: deck._count.cards,
      due: dueCards,
      mastery,
    };
  });

  // Real leaderboard from review counts
  const topUsers = await prisma.user.findMany({
    select: { id: true, name: true, _count: { select: { reviews: true } } },
    orderBy: { reviews: { _count: 'desc' } },
    take: 5,
  });

  const leaderboard = topUsers.map((u, i) => ({
    rank: i + 1,
    name: u.id === dbUser.id ? `${u.name?.split(' ')[0]} (You)` : (u.name?.split(' ')[0] ?? 'Anonymous'),
    score: u._count.reviews * 10,
    isYou: u.id === dbUser.id,
  }));

  // If user isn't in top 5, add them
  if (!leaderboard.some(u => u.isYou)) {
    leaderboard.push({
      rank: leaderboard.length + 1,
      name: `${dbUser.name?.split(' ')[0]} (You)`,
      score: dbUser._count.reviews * 10,
      isYou: true,
    });
  }

  const stats = [
    { label: "Total Decks", value: decks.length, icon: Layers, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { label: "Total Cards", value: totalCards, icon: BookOpen, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { label: "Due Today", value: totalDue, icon: Clock, color: totalDue > 0 ? "text-amber-400" : "text-emerald-400", bg: totalDue > 0 ? "bg-amber-500/10" : "bg-emerald-500/10", border: totalDue > 0 ? "border-amber-500/20" : "border-emerald-500/20" },
    { label: "Day Streak", value: dbUser.streak, icon: Zap, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ];

  const rankEmoji = ["👑", "🥈", "🥉", "⚡", "✨"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter text-indigo-400">
            MEMORIA
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/analytics" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Analytics</Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-sm">
              <Flame size={16} />
              {dbUser.streak} day streak
            </div>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Hero */}
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome back, {dbUser.name?.split(' ')[0]}</h1>
            <p className="text-slate-400 text-lg">
              {totalDue > 0 
                ? <>You have <span className="text-amber-400 font-semibold">{totalDue} cards</span> due for review today.</>
                : <span className="text-emerald-400 font-semibold">All caught up! Great job 🎉</span>
              }
            </p>
          </div>
          <Link href="/create">
            <Button size="lg" className="rounded-full px-8 font-bold bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-105">
              <Plus className="mr-2 h-5 w-5" />
              New Deck
            </Button>
          </Link>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className={`p-5 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-sm transition-all hover:scale-[1.03]`}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`${stat.color}`} size={22} />
                <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Decks Section */}
        <DeckGrid decks={decks} />

        {/* Leaderboard */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 space-y-6">
          <div className="flex items-center gap-3">
             <Trophy className="text-indigo-500" size={24} />
             <h2 className="text-2xl font-bold uppercase tracking-widest">Leaderboard</h2>
          </div>
          <div className="space-y-3">
             {leaderboard.map((user) => (
               <div key={user.rank} className={`flex items-center justify-between p-4 rounded-xl transition-all ${user.isYou ? "bg-indigo-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/5" : "bg-slate-950/50 hover:bg-slate-900/50"}`}>
                 <div className="flex items-center gap-4">
                   <span className="text-slate-500 font-bold w-6 text-center">{user.rank}</span>
                   <span className="text-xl">{rankEmoji[user.rank - 1] ?? "🌟"}</span>
                   <span className={`font-bold ${user.isYou ? 'text-indigo-300' : ''}`}>{user.name}</span>
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
