"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

interface AdminChartsProps {
  reviewsByDay: { day: string; count: number }[];
  topDecks: { name: string; cards: number; author: string }[];
}

const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#ec4899"];

export function AdminCharts({ reviewsByDay, topDecks }: AdminChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-[350px] rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col">
        <h3 className="mb-4 text-lg font-bold text-slate-100">Reviews This Week</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={reviewsByDay}>
            <defs>
              <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
              itemStyle={{ color: "#f8fafc" }}
            />
            <Area type="monotone" dataKey="count" stroke="#6366f1" fillOpacity={1} fill="url(#colorReviews)" name="Reviews" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[350px] rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col">
        <h3 className="mb-4 text-lg font-bold text-slate-100">Largest Decks</h3>
        {topDecks.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topDecks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                itemStyle={{ color: "#f8fafc" }}
                cursor={{ fill: '#ffffff10' }}
              />
              <Bar dataKey="cards" radius={[4, 4, 0, 0]} name="Cards">
                {topDecks.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-600">No decks yet</div>
        )}
      </div>
    </div>
  );
}
