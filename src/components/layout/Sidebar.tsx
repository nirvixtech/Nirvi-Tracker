import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  TrendingUp,
  Wrench,
  Server,
  Globe,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import logo from "../../assets/logo.png";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/projects", label: "Projects", icon: FolderOpen },
  { path: "/upcoming", label: "Upcoming", icon: TrendingUp },
  { path: "/ongoing", label: "Ongoing", icon: Wrench },
  { path: "/servers", label: "Servers", icon: Server, badge: 2 },
  { path: "/domains", label: "Domains", icon: Globe, badge: 2 },
  { path: "/team", label: "Team", icon: Users },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative h-screen bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Nirvi Track" className="w-13 h-13object-contain shrink-0" />
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col"
            >
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Nirvi Track
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                Project Tracker
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
                      collapsed && "justify-center px-2 relative",
                    ].join(" ")
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="size-5 shrink-0" />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-semibold text-white bg-red-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-semibold text-white bg-red-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[11px] text-slate-400 dark:text-slate-500"
          >
            &copy; 2026 Nirvi Track
          </motion.p>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex items-center justify-center size-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-sm cursor-pointer transition-colors"
      >
        {collapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
      </button>
    </motion.aside>
  );
}
