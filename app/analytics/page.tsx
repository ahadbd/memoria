import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Flame, BookOpen, Target, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default async function AnalyticsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      decks: {
        include: {
          _count: { select: { cards: true } },
          cards: {
            select: { reps: true, stability: true, difficulty: true, nextReview: true }
          }
        }
      },
      reviews: {
        orderBy: { reviewDate: 'desc' },
        take: 100,
        select: { rating: true, reviewDate: true }
      }
    }
  });

  if (!dbUser) redirect("/sign-in");

  const totalCards = dbUser.decks.reduce((a, d) => a + d._count.cards, 0);
  const totalReviews = dbUser.reviews.length;
  const totalDecks = dbUser.decks.length;
  const dueToday = dbUser.decks.reduce((a, d) => a + d.cards.filter(c => new Date(c.nextReview) <= new Date()).length, 0);

  const allCards = dbUser.decks.flatMap(d => d.cards);
  const avgStability = allCards.length > 0 ? (allCards.reduce((a, c) => a + c.stability, 0) / allCards.length).toFixed(1) : "0";
  const avgDifficulty = allCards.length > 0 ? (allCards.reduce((a, c) => a + c.difficulty, 0) / allCards.length).toFixed(1) : "0";
  const masteredCards = allCards.filter(c => c.reps >= 3).length;
  const masteryPercent = allCards.length > 0 ? Math.round((masteredCards / allCards.length) * 100) : 0;

  // Rating distribution from recent reviews
  const ratingDist = [0, 0, 0, 0]; // Again, Hard, Good, Easy
  dbUser.reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 4) ratingDist[r.rating - 1]++;
  });
  const avgRating = totalReviews > 0 ? (dbUser.reviews.reduce((a, r) => a + r.rating, 0) / totalReviews).toFixed(1) : "—";

  // Reviews per day (last 7 days)
  const last7Days: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const count = dbUser.reviews.filter((r: any) => {
      const rd = new Date(r.reviewDate);
      return rd.toDateString() === d.toDateString();
    }).length;
    last7Days.push({ day: dayStr, count });
  }
  const maxDayCount = Math.max(...last7Days.map(d => d.count), 1);

  // Per-deck mastery
  const deckStats = dbUser.decks.map(d => {
    const reviewed = d.cards.filter(c => c.reps > 0).length;
    const mastery = d._count.cards > 0 ? Math.round((reviewed / d._count.cards) * 100) : 0;
    return { title: d.title, total: d._count.cards, reviewed, mastery };
  });

  const stats = [
    { label: "Total Reviews", value: totalReviews, icon: Target, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Cards Mastered", value: `${masteredCards}/${totalCards}`, icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Avg Rating", value: avgRating, icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { label: "Avg Stability", value: `${avgStability}d`, icon: Clock, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { label: "Due Today", value: dueToday, icon: BarChart3, color: dueToday > 0 ? "text-amber-400" : "text-emerald-400", bg: dueToday > 0 ? "bg-amber-500/10" : "bg-emerald-500/10", border: dueToday > 0 ? "border-amber-500/20" : "border-emerald-500/20" },
    { label: "Day Streak", value: dbUser.streak, icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ];

  const ratingLabels = ["Again", "Hard", "Good", "Easy"];
  const ratingColors = ["bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-emerald-500"];
  const ratingTextColors = ["text-rose-400", "text-amber-400", "text-sky-400", "text-emerald-400"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter text-indigo-400">MEMORIA</Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Dashboard</Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-white transition-colors group mb-2">
              <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight">Your Analytics</h1>
            <p className="text-slate-400">Deep dive into your learning journey</p>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className={`p-4 rounded-2xl border ${stat.border} ${stat.bg} transition-all hover:scale-[1.03]`}>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={stat.color} size={18} />
              </div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weekly Activity */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
            <h2 className="text-lg font-bold">Weekly Activity</h2>
            <div className="flex items-end gap-3 h-40">
              {last7Days.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">{d.count}</span>
                  <div className="w-full rounded-t-md bg-indigo-500/60 transition-all" style={{ height: `${(d.count / maxDayCount) * 100}%`, minHeight: d.count > 0 ? '8px' : '2px' }} />
                  <span className="text-[10px] font-bold text-slate-600 uppercase">{d.day}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Rating Distribution */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
            <h2 className="text-lg font-bold">Rating Distribution</h2>
            {totalReviews > 0 ? (
              <div className="space-y-4">
                {ratingLabels.map((label, i) => {
                  const pct = totalReviews > 0 ? Math.round((ratingDist[i] / totalReviews) * 100) : 0;
                  return (
                    <div key={label} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className={`font-bold ${ratingTextColors[i]}`}>{label}</span>
                        <span className="text-slate-500 font-mono">{ratingDist[i]} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${ratingColors[i]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-slate-600 font-medium">No reviews yet. Start studying!</div>
            )}
          </section>
        </div>

        {/* Overall Mastery */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Overall Mastery</h2>
            <span className="text-2xl font-black text-indigo-400">{masteryPercent}%</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">{masteredCards} of {totalCards} cards mastered (3+ successful reviews)</p>
        </section>

        {/* Per-Deck Breakdown */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <h2 className="text-lg font-bold">Per-Deck Breakdown</h2>
          {deckStats.length > 0 ? (
            <div className="space-y-4">
              {deckStats.map((d) => (
                <div key={d.title} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm truncate max-w-[60%]">{d.title}</span>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{d.reviewed}/{d.total} reviewed</span>
                      <span className={`font-bold ${d.mastery >= 80 ? 'text-emerald-400' : d.mastery >= 40 ? 'text-amber-400' : 'text-indigo-400'}`}>
                        {d.mastery}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${d.mastery >= 80 ? 'bg-emerald-500' : d.mastery >= 40 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                      style={{ width: `${d.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-20 flex items-center justify-center text-slate-600 font-medium">No decks yet</div>
          )}
        </section>
      </main>
    </div>
  );
}
