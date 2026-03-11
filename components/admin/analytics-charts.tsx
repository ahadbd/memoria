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

const dauData = [
  { name: "Mon", users: 1200 },
  { name: "Tue", users: 1500 },
  { name: "Wed", users: 1800 },
  { name: "Thu", users: 1700 },
  { name: "Fri", users: 2100 },
  { name: "Sat", users: 2400 },
  { name: "Sun", users: 2420 },
];

const subjectData = [
  { name: "Chemistry", cards: 4500, color: "#6366f1" },
  { name: "CS", cards: 3800, color: "#8b5cf6" },
  { name: "Medicine", cards: 3200, color: "#ec4899" },
  { name: "Spanish", cards: 2800, color: "#f43f5e" },
  { name: "History", cards: 2100, color: "#f59e0b" },
];

export function AnalyticsCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-[400px] rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col">
        <h3 className="mb-4 text-lg font-medium text-slate-100">Daily Active Users (DAU)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dauData}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
              itemStyle={{ color: "#f8fafc" }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#colorUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[400px] rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col">
        <h3 className="mb-4 text-lg font-medium text-slate-100">Popular Subjects</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={subjectData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
              itemStyle={{ color: "#f8fafc" }}
              cursor={{ fill: '#ffffff10' }}
            />
            <Bar dataKey="cards" radius={[4, 4, 0, 0]}>
              {subjectData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
