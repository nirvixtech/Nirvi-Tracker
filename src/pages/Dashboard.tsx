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
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { cn } from "../lib/utils";
import { fetchDashboard } from "../lib/api";

const resourceMeta: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  Servers: {
    icon: Server,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  Domains: {
    icon: Globe,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  Team: {
    icon: Users,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
};

const tooltipStyle = {
  backgroundColor: "rgba(15, 23, 42, 0.92)",
  border: "none",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "12px",
  color: "#f1f5f9",
  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.25)",
};

function SkeletonBlock({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80",
        className,
      )}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-40 rounded-lg" />
        <SkeletonBlock className="h-4 w-full max-w-md rounded-md" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="ring-0 shadow-sm border-slate-200/60 dark:border-slate-700/90 dark:bg-slate-900/85"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="size-10 rounded-xl" />
                  <div className="space-y-2">
                    <SkeletonBlock className="h-4 w-20 rounded-md" />
                    <SkeletonBlock className="h-7 w-16 rounded-md" />
                  </div>
                </div>
                <SkeletonBlock className="h-6 w-14 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 ring-0 shadow-sm border-slate-200/60 dark:border-slate-700/90 dark:bg-slate-900/85">
          <CardHeader className="pb-2 space-y-2">
            <SkeletonBlock className="h-5 w-36 rounded-md" />
            <SkeletonBlock className="h-4 w-52 rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="h-60 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-700/80 dark:bg-slate-950/30">
              <div className="relative h-full w-full">

                {/* bottom labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonBlock
                      key={index}
                      className="h-3 w-8 rounded-md"
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ring-0 shadow-sm border-slate-200/60 dark:border-slate-700/90 dark:bg-slate-900/85">
          <CardHeader className="pb-2 space-y-2">
            <SkeletonBlock className="h-5 w-36 rounded-md" />
            <SkeletonBlock className="h-4 w-44 rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center">
              <SkeletonBlock className="size-32 rounded-full" />
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <SkeletonBlock className="size-2.5 rounded-full" />
                  <SkeletonBlock className="h-3 w-20 rounded-md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

/*  Scroll Animation Wrapper  */
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

/* Stat Card */
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

/* Dashboard  */
export default function Dashboard() {
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  if (dashboardQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border border-dashed border-rose-200 px-5 py-12 text-center text-sm text-rose-500 dark:border-rose-900 dark:text-rose-300">
          Could not load dashboard data from the API. Start the Express server and try again.
        </div>
      </div>
    );
  }

  const dashboard = dashboardQuery.data;

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
          <StatCard icon={FolderOpen} label="Total Projects" value={`${dashboard.stats.totalProjects}`} change="+12%" />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <StatCard icon={Wrench} label="Active" value={`${dashboard.stats.active}`} change="+2" />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <StatCard icon={TrendingUp} label="Upcoming" value={`${dashboard.stats.upcoming}`} change="+1" />
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <StatCard icon={CheckCircle2} label="Completed" value={`${dashboard.stats.completed}`} change="+4" />
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
                    <AreaChart data={dashboard.trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
                        data={dashboard.statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {dashboard.statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 justify-center mt-3">
                  {dashboard.statusData.map((s) => (
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
                {dashboard.recentProjects.map((project) => (
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
                {dashboard.resourceData.map((r) => {
                  const meta = resourceMeta[r.name];
                  if (!meta) {
                    return null;
                  }
                  const Icon = meta.icon;
                  return (
                    <motion.div
                      key={r.name}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50 dark:border-slate-700/90 dark:bg-slate-800/40 cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center size-9 rounded-lg ${meta.bg} group-hover/card:!bg-blue-600 group-hover/card:!text-white dark:group-hover/card:!bg-blue-500 transition-colors duration-300`}>
                          <Icon className={`size-4 ${meta.color} group-hover/card:!text-white transition-colors duration-300`} />
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
                    <BarChart data={dashboard.resourceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
