import prisma from "@/lib/prisma";
import { SettingsPanel } from "@/components/admin/settings-panel";

export default async function SettingsPage() {
  const [totalUsers, totalDecks, totalCards, totalReviews, suspendedUsers, publicDecks] =
    await Promise.all([
      prisma.user.count(),
      prisma.deck.count(),
      prisma.card.count(),
      prisma.review.count(),
      prisma.user.count({ where: { isSuspended: true } }),
      prisma.deck.count({ where: { isPublic: true } }),
    ]);

  const stats = {
    totalUsers,
    totalDecks,
    totalCards,
    totalReviews,
    suspendedUsers,
    publicDecks,
    dbProvider: "PostgreSQL",
    nodeEnv: process.env.NODE_ENV ?? "development",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-50">Settings</h2>
        <p className="text-slate-400">Platform configuration and system information.</p>
      </div>
      <SettingsPanel stats={stats} />
    </div>
  );
}
