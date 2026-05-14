import { motion } from "framer-motion";
import {
  FolderOpen,
  Wrench,
  TrendingUp,
  CheckCircle2,
  Server,
  Globe,
  Users,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/* ─── Mock Data ─── */
const trendData = [
  { month: "Jan", projects: 4, tasks: 24 },
  { month: "Feb", projects: 6, tasks: 32 },
  { month: "Mar", projects: 8, tasks: 45 },
  { month: "Apr", projects: 5, tasks: 38 },
  { month: "May", projects: 9, tasks: 52 },
  { month: "Jun", projects: 12, tasks: 64 },
];

const statusData = [
  { name: "Completed", value: 18, color: "#3b82f6" },
  { name: "Ongoing", value: 9, color: "#f59e0b" },
  { name: "Upcoming", value: 5, color: "#10b981" },
  { name: "On Hold", value: 2, color: "#ef4444" },
];

const resourceData = [
  { name: "Servers", count: 8, change: +2, icon: Server, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { name: "Domains", count: 14, change: +3, icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  { name: "Team", count: 6, change: 0, icon: Users, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
];

const recentProjects = [
  { name: "E-Commerce API", status: "Ongoing", progress: 72, updated: "2h ago" },
  { name: "Portfolio Redesign", status: "Completed", progress: 100, updated: "1d ago" },
  { name: "CRM Dashboard", status: "Upcoming", progress: 0, updated: "3d ago" },
  { name: "Analytics Engine", status: "Ongoing", progress: 45, updated: "5d ago" },
];

const tooltipStyle = {
  backgroundColor: "rgba(15, 23, 42, 0.92)",
  border: "none",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "12px",
  color: "#f1f5f9",
  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.25)",
};

/* ─── Scroll Animation Wrapper ─── */
function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stat Card ─── */
function StatCard({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="ring-0 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/10 transition-shadow duration-300 border-slate-200/60 dark:border-slate-700/90 dark:bg-slate-900/85 cursor-default">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 group-hover/card:bg-blue-600 group-hover/card:text-white dark:group-hover/card:bg-blue-500 transition-colors duration-300">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-sm trykker-regular text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-2xl calistoga-regular text-slate-800 dark:text-slate-100 mt-0.5">{value}</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-xs font-medium trykker-regular px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="size-3" />
              {change}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Dashboard ─── */
export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <ScrollReveal>
        <div>
          <h1 className="text-2xl calistoga-regular text-slate-800 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="trykker-regular text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your projects.
          </p>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScrollReveal delay={0.05}>
          <StatCard icon={FolderOpen} label="Total Projects" value="34" change="+12%" />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <StatCard icon={Wrench} label="Active" value="9" change="+2" />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <StatCard icon={TrendingUp} label="Upcoming" value="5" change="+1" />
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <StatCard icon={CheckCircle2} label="Completed" value="18" change="+4" />
        </ScrollReveal>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line Chart */}
        <ScrollReveal delay={0.1} className="lg:col-span-2">
          <motion.div>
            <Card className="ring-0 shadow-sm border-slate-200/60 dark:border-slate-700/90 dark:bg-slate-900/85 cursor-default">
              <CardHeader className="pb-2">
                <CardTitle className="text-base calistoga-regular text-slate-800 dark:text-slate-100">
                  Project Activity
                </CardTitle>
                <CardDescription className="trykker-regular">
                  Projects & tasks over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }} />
                      <Area type="monotone" dataKey="projects" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorProjects)" name="Projects" />
                      <Area type="monotone" dataKey="tasks" stroke="#10b981" strokeWidth={2} fill="url(#colorTasks)" name="Tasks" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </ScrollReveal>

        {/* Pie chart */}
        <ScrollReveal delay={0.15}>
          <motion.div>
            <Card className="ring-0 shadow-sm border-slate-200/60 dark:border-slate-700/90 dark:bg-slate-900/85 cursor-default">
              <CardHeader className="pb-2">
                <CardTitle className="text-base calistoga-regular text-slate-800 dark:text-slate-100">
                  Status Breakdown
                </CardTitle>
                <CardDescription className="trykker-regular">
                  Distribution by current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 justify-center mt-3">
                  {statusData.map((s) => (
                    <div key={s.name} className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-xs trykker-regular text-slate-600 dark:text-slate-300">
                        {s.name} ({s.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </ScrollReveal>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Projects */}
        <ScrollReveal delay={0.1} className="lg:col-span-2">
          <motion.div>
            <Card className="ring-0 shadow-sm transition-shadow duration-300 border-slate-200/60 dark:border-slate-700/90 dark:bg-slate-900/85 cursor-default">
              <CardHeader className="pb-3">
                <CardTitle className="text-base calistoga-regular text-slate-800 dark:text-slate-100">
                  Recent Projects
                </CardTitle>
                <CardDescription className="trykker-regular">
                  Latest updates from your project pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentProjects.map((project) => (
                  <motion.div
                    key={project.name}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-4 p-3 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 dark:!border-slate-600/90 dark:!bg-slate-900 dark:hover:!bg-slate-800/90 cursor-default"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 trykker-regular truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 trykker-regular mt-0.5">
                        Updated {project.updated}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full trykker-regular shrink-0 ${project.status === "Completed"
                        ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                        : project.status === "Ongoing"
                          ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                          : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                        }`}
                    >
                      {project.status}
                    </span>
                    <div className="hidden sm:block w-24 shrink-0">
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right mt-0.5 trykker-regular">
                        {project.progress}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </ScrollReveal>

        {/* Resources / Bar graph */}
        <ScrollReveal delay={0.15}>
          <motion.div>
            <Card className="ring-0 shadow-sm border-slate-200/60 dark:border-slate-700/90 dark:bg-slate-900/85 cursor-default">
              <CardHeader className="pb-3">
                <CardTitle className="text-base calistoga-regular text-slate-800 dark:text-slate-100">
                  Resources
                </CardTitle>
                <CardDescription className="trykker-regular">
                  Infrastructure overview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {resourceData.map((r) => {
                  const Icon = r.icon;
                  return (
                    <motion.div
                      key={r.name}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50 dark:border-slate-700/90 dark:bg-slate-800/40 cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center size-9 rounded-lg ${r.bg} group-hover/card:!bg-blue-600 group-hover/card:!text-white dark:group-hover/card:!bg-blue-500 transition-colors duration-300`}>
                          <Icon className={`size-4 ${r.color} group-hover/card:!text-white transition-colors duration-300`} />
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-200 trykker-regular">
                          {r.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 calistoga-regular">
                          {r.count}
                        </span>
                        {r.change !== 0 && (
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            +{r.change}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                <div className="pt-2 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={resourceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(148,163,184,0.1)" }} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
}
