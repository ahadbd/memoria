import prisma from "@/lib/prisma";
import { AdminUsersTable } from "@/components/admin/users-table";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { decks: true, reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const userData = users.map(u => ({
    id: u.id,
    name: u.name ?? "Anonymous",
    email: u.email,
    role: u.role as "STUDENT" | "ADMIN",
    isPro: u.isPro,
    isSuspended: u.isSuspended,
    streak: u.streak,
    decks: u._count.decks,
    reviews: u._count.reviews,
    joinedAt: u.createdAt.toISOString().split('T')[0],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-50">User Management</h2>
        <p className="text-slate-400">Manage user roles, Pro status, and suspensions. {users.length} total users.</p>
      </div>
      <AdminUsersTable users={userData} />
    </div>
  );
}
