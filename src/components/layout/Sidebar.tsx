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
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

const navItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/projects", label: "Projects", icon: FolderOpen },
  { path: "/upcoming", label: "Upcoming", icon: TrendingUp },
  { path: "/ongoing", label: "Ongoing", icon: Wrench },
  { path: "/servers", label: "Servers", icon: Server },
  { path: "/domains", label: "Domains", icon: Globe },
  { path: "/team", label: "Team", icon: Users },
];

interface SidebarInnerProps {
  collapsed: boolean;
  onToggle: () => void;
  showToggle?: boolean;
  onNavigate?: () => void;
}

function SidebarInner({ collapsed, onToggle, showToggle = true, onNavigate }: SidebarInnerProps) {
  return (
    <>
      {/* Logo */}
      <div
        className={`flex items-center h-16 border-b border-slate-200/80 dark:border-slate-800 shrink-0 ${collapsed ? "px-2 justify-center" : "px-4"
          }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={logo}
            alt="Nirvi Track"
            className={`object-contain shrink-0 ${collapsed ? "w-13 h-13" : "w-13 h-13"}`}
          />
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col"
            >
              <span className="text-sm calistoga-regular text-slate-800 dark:text-slate-100 leading-tight">
                Nirvi Track
              </span>
              <span className="text-[11px] courgette-regular text-slate-400 dark:text-slate-500 leading-tight">
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
                  onClick={onNavigate}
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
                      className="truncate trykker-regular"
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
      <div
        className={`flex items-center border-t border-slate-200/80 dark:border-slate-800 shrink-0 ${collapsed ? "px-2 py-3 justify-center" : "px-4 py-3"
          }`}
      >
        {!collapsed && (
          <>
            {showToggle && <div className="w-7 shrink-0" />}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-[12px] trykker-regular text-slate-400 dark:text-slate-500 flex-1 text-center"
            >
              &copy; {new Date().getFullYear()} Nirvi Track
            </motion.p>
          </>
        )}
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="shrink-0 flex items-center justify-center size-7 rounded-md bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          </button>
        )}
      </div>
    </>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:flex relative h-screen bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex-col shrink-0 overflow-hidden"
      >
        <SidebarInner
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          showToggle={true}
        />
      </motion.aside>

      {/* Mobile sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : -280 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="fixed md:hidden top-0 left-0 h-screen w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col shrink-0 overflow-hidden z-50"
      >
        <button
          type="button"
          onClick={onMobileClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>
        <SidebarInner
          collapsed={false}
          onToggle={() => { }}
          showToggle={false}
          onNavigate={onMobileClose}
        />
      </motion.aside>
    </>
  );
}
