import { Users, Library, CheckCircle2, Clock, TrendingUp, Layers } from "lucide-react";
import prisma from "@/lib/prisma";
import { AdminCharts } from "@/components/admin/admin-charts";

export default async function AdminPage() {
  const [userCount, deckCount, cardCount, reviewCount] = await Promise.all([
    prisma.user.count(),
    prisma.deck.count(),
    prisma.card.count(),
    prisma.review.count(),
  ]);

  const recentReviews = await prisma.review.findMany({
    orderBy: { reviewDate: 'desc' },
    take: 50,
    select: { rating: true, reviewDate: true, user: { select: { name: true } } }
  });

  const activeUsers = await prisma.user.count({
    where: { lastStudyDate: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
  });

  const suspendedUsers = await prisma.user.count({ where: { isSuspended: true } });

  // Recent reviews per day for chart
  const reviewsByDay: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const start = new Date(d.toDateString());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const count = await prisma.review.count({
      where: { reviewDate: { gte: start, lt: end } }
    });
    reviewsByDay.push({ day: d.toLocaleDateString('en-US', { weekday: 'short' }), count });
  }

  // Top decks by card count
  const topDecks = await prisma.deck.findMany({
    include: { _count: { select: { cards: true } }, user: { select: { name: true } } },
    orderBy: { cards: { _count: 'desc' } },
    take: 5,
  });

  const stats = [
    { name: "Total Users", value: userCount.toLocaleString(), icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { name: "Active (7d)", value: activeUsers.toLocaleString(), icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { name: "Total Decks", value: deckCount.toLocaleString(), icon: Library, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { name: "Total Cards", value: cardCount.toLocaleString(), icon: Layers, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { name: "Total Reviews", value: reviewCount.toLocaleString(), icon: CheckCircle2, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { name: "Suspended", value: suspendedUsers.toLocaleString(), icon: Clock, color: suspendedUsers > 0 ? "text-rose-400" : "text-slate-500", bg: suspendedUsers > 0 ? "bg-rose-500/10" : "bg-slate-500/10", border: suspendedUsers > 0 ? "border-rose-500/20" : "border-slate-800" },
  ];

  const topDecksData = topDecks.map(d => ({
    name: d.title.length > 20 ? d.title.slice(0, 20) + '...' : d.title,
    cards: d._count.cards,
    author: d.user.name?.split(' ')[0] ?? 'Unknown',
  }));

  // Recent activity log
  const recentActivity = recentReviews.slice(0, 8).map(r => ({
    user: r.user.name?.split(' ')[0] ?? 'User',
    action: `rated a card ${['Again', 'Hard', 'Good', 'Easy'][r.rating - 1]}`,
    time: new Date(r.reviewDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    ratingColor: ['text-rose-400', 'text-amber-400', 'text-sky-400', 'text-emerald-400'][r.rating - 1],
  }));

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`p-5 rounded-2xl border ${stat.border} ${stat.bg} transition-all hover:scale-[1.03]`}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={stat.color} size={20} />
            </div>
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AdminCharts reviewsByDay={reviewsByDay} topDecks={topDecksData} />

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
        <h3 className="text-lg font-bold">Recent Activity</h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                    {a.user[0]}
                  </div>
                  <span>
                    <span className="font-bold text-slate-200">{a.user}</span>
                    {' '}
                    <span className="text-slate-500">{a.action.replace(/Again|Hard|Good|Easy/, '')}</span>
                    <span className={`font-bold ${a.ratingColor}`}>{['Again', 'Hard', 'Good', 'Easy'].find(r => a.action.includes(r))}</span>
                  </span>
                </div>
                <span className="text-xs text-slate-600 font-mono">{a.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-sm">No recent activity</p>
        )}
      </div>
    </div>
  );
}
