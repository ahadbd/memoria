import prisma from "@/lib/prisma";
import { AdminSetsTable } from "@/components/admin/sets-table";

export default async function StudySetsPage() {
  const decks = await prisma.deck.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { cards: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const setsData = decks.map(d => ({
    id: d.id,
    title: d.title,
    author: d.user.name ?? d.user.email,
    cards: d._count.cards,
    isPublic: d.isPublic,
    createdAt: d.createdAt.toISOString().split('T')[0],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-50">Study Sets</h2>
        <p className="text-slate-400">View and manage all decks across the platform. {decks.length} total sets.</p>
      </div>
      <AdminSetsTable sets={setsData} />
    </div>
  );
}
