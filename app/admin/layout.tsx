import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard, Library, Users, ShieldAlert, Settings } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const sidebarItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Study Sets", href: "/admin/sets", icon: Library },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Moderation", href: "/admin/moderation", icon: ShieldAlert },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <Link href="/" className="text-xl font-bold tracking-tighter text-indigo-400">
            MEMORIA
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-50"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-800 px-8">
          <h1 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Admin Command Center</h1>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
