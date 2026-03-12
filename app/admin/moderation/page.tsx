import prisma from "@/lib/prisma";
import { ModerationPanel } from "@/components/admin/moderation-panel";

export default async function ModerationPage() {
  const [suspendedUsers, publicDecks] = await Promise.all([
    prisma.user.findMany({
      where: { isSuspended: true },
      include: { _count: { select: { decks: true, reviews: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.deck.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { cards: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const suspendedData = suspendedUsers.map((u) => ({
    id: u.id,
    name: u.name ?? "Anonymous",
    email: u.email,
    streak: u.streak,
    decks: u._count.decks,
    reviews: u._count.reviews,
    suspendedSince: u.updatedAt.toISOString().split("T")[0],
  }));

  const publicDecksData = publicDecks.map((d) => ({
    id: d.id,
    title: d.title,
    author: d.user.name ?? d.user.email,
    cards: d._count.cards,
    isPublic: d.isPublic,
    createdAt: d.createdAt.toISOString().split("T")[0],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-50">Moderation</h2>
        <p className="text-slate-400">
          Review suspended users and moderate public content.{" "}
          {suspendedUsers.length} suspended user{suspendedUsers.length !== 1 ? "s" : ""},{" "}
          {publicDecks.length} public deck{publicDecks.length !== 1 ? "s" : ""}.
        </p>
      </div>
      <ModerationPanel suspendedUsers={suspendedData} publicDecks={publicDecksData} />
    </div>
  );
}
