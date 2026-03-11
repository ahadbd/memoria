"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Flag, Star } from "lucide-react";

interface StudySet {
  id: string;
  title: string;
  author: string;
  cards: number;
  status: "Featured" | "Public" | "Flagged";
  createdAt: string;
}

const data: StudySet[] = [
  { id: "1", title: "Organic Chemistry Basics", author: "Dr. Smith", cards: 45, status: "Featured", createdAt: "2024-03-01" },
  { id: "2", title: "Web Development 101", author: "Jane Doe", cards: 120, status: "Public", createdAt: "2024-03-05" },
  { id: "3", title: "Medical Terminology", author: "John Watson", cards: 200, status: "Flagged", createdAt: "2024-03-10" },
  { id: "4", title: "Spanish Vocabulary", author: "Maria Garcia", cards: 80, status: "Public", createdAt: "2024-03-12" },
];

export const columns: ColumnDef<StudySet>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="font-medium text-slate-100">{row.getValue("title")}</span>,
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "cards",
    header: "Cards",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Featured" ? "indigo" : status === "Flagged" ? "rose" : "slate"}>
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
          <Button variant="ghost" size="icon" title="Feature Set">
            <Star className="h-4 w-4 text-amber-400" />
          </Button>
          <Button variant="ghost" size="icon" title="Flag Set">
            <Flag className="h-4 w-4 text-rose-400" />
          </Button>
        </div>
      );
    },
  },
];

export default function StudySetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-50">Study Sets</h2>
        <p className="text-slate-400">Manage and moderate user-created study sets.</p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
