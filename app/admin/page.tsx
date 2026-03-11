import { ArrowUpRight, ArrowDownRight, Users, Library, CheckCircle2, Clock } from "lucide-react";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";

const stats = [
  { name: "Total DAU", value: "2,420", change: "+12%", trend: "up", icon: Users },
  { name: "Cards Studied", value: "45,892", change: "+24%", trend: "up", icon: CheckCircle2 },
  { name: "Active Sets", value: "842", change: "-3%", trend: "down", icon: Library },
  { name: "Avg. Session", value: "18m 42s", change: "+5%", trend: "up", icon: Clock },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-indigo-500/50"
          >
            <div className="absolute -right-4 -top-4 text-indigo-500/10 transition-transform group-hover:scale-110">
              <stat.icon size={120} />
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">{stat.name}</p>
              <div className={`flex items-center gap-0.5 text-xs font-semibold ${
                stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-50">{stat.value}</p>
          </div>
        ))}
      </div>

      <AnalyticsCharts />
    </div>
  );
}
