"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldCheck, ShieldAlert, UserPlus } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Admin";
  isPro: boolean;
  status: "Active" | "Suspended";
}

const data: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", isPro: true, status: "Active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Student", isPro: false, status: "Active" },
  { id: "3", name: "Bad Actor", email: "bad@example.com", role: "Student", isPro: false, status: "Suspended" },
];

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium text-slate-100">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={role === "Admin" ? "indigo" : "slate"}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isPro",
    header: "Pro",
    cell: ({ row }) => (row.getValue("isPro") ? <Badge variant="emerald">Pro</Badge> : null),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Suspended" ? "rose" : "emerald"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Upgrade/Pro">
            <UserPlus className="h-4 w-4 text-emerald-400" />
          </Button>
          <Button variant="ghost" size="icon" title="Suspend User">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </Button>
        </div>
      );
    },
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-50">User Management</h2>
        <p className="text-slate-400">Upgrade accounts to Pro or manage suspensions.</p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
