"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ShieldAlert, Flame, Search } from "lucide-react";
import { toggleSuspendUser, toggleUserRole } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  isPro: boolean;
  isSuspended: boolean;
  streak: number;
  decks: number;
  reviews: number;
  joinedAt: string;
}

export function AdminUsersTable({ users }: { users: User[] }) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuspend = (userId: string) => {
    startTransition(async () => {
      await toggleSuspendUser(userId);
      router.refresh();
    });
  };

  const handleRoleToggle = (userId: string) => {
    startTransition(async () => {
      await toggleUserRole(userId);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Search users..."
          className="pl-10 bg-slate-900/80 border-slate-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-400 text-left">
            <tr>
              <th className="p-4 font-bold text-xs uppercase tracking-widest">User</th>
              <th className="p-4 font-bold text-xs uppercase tracking-widest">Role</th>
              <th className="p-4 font-bold text-xs uppercase tracking-widest">Status</th>
              <th className="p-4 font-bold text-xs uppercase tracking-widest text-center">Decks</th>
              <th className="p-4 font-bold text-xs uppercase tracking-widest text-center">Reviews</th>
              <th className="p-4 font-bold text-xs uppercase tracking-widest text-center">Streak</th>
              <th className="p-4 font-bold text-xs uppercase tracking-widest">Joined</th>
              <th className="p-4 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <div>
                    <span className="font-bold text-slate-100">{user.name}</span>
                    <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={user.role === "ADMIN" ? "indigo" : "slate"} className="text-[10px]">
                    {user.role}
                  </Badge>
                </td>
                <td className="p-4">
                  {user.isSuspended ? (
                    <Badge variant="rose" className="text-[10px]">Suspended</Badge>
                  ) : (
                    <Badge variant="emerald" className="text-[10px]">Active</Badge>
                  )}
                </td>
                <td className="p-4 text-center font-mono text-slate-400">{user.decks}</td>
                <td className="p-4 text-center font-mono text-slate-400">{user.reviews}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Flame size={12} className="text-orange-400" />
                    <span className="font-mono text-orange-400 text-xs font-bold">{user.streak}</span>
                  </div>
                </td>
                <td className="p-4 text-xs text-slate-500 font-mono">{user.joinedAt}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={user.role === "ADMIN" ? "Demote to Student" : "Promote to Admin"}
                      onClick={() => handleRoleToggle(user.id)}
                      disabled={isPending}
                      className="h-8 w-8"
                    >
                      <ShieldCheck className="h-4 w-4 text-indigo-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title={user.isSuspended ? "Unsuspend" : "Suspend"}
                      onClick={() => handleSuspend(user.id)}
                      disabled={isPending}
                      className="h-8 w-8"
                    >
                      <ShieldAlert className={`h-4 w-4 ${user.isSuspended ? 'text-emerald-400' : 'text-rose-400'}`} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-600">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
