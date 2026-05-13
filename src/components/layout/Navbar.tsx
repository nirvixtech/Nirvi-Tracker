import { useNavigate } from "react-router-dom";
import { Search, Bell, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeToggle from "../ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-6 gap-4"
    >
      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search projects, clients, domains, servers..."
          className="h-10 w-full rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 pl-9 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-blue-500/30 focus-visible:border-blue-400/50"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button
          type="button"
          className="relative flex items-center justify-center size-9 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Bell className="size-5" />
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-semibold text-white bg-red-500 rounded-full border-2 border-white dark:border-slate-900">
            2
          </span>
        </button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer outline-none"
            >
              <Avatar className="size-8 bg-blue-500">
                <AvatarFallback className="bg-blue-500 text-white">
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Nirvix</span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-56 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 shadow-lg rounded-xl p-2"
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Nirvix</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admin</p>
            </div>
            <DropdownMenuSeparator className="bg-slate-200/80 dark:bg-slate-700 my-1.5" />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
              className="cursor-pointer rounded-lg text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600 dark:focus:text-red-400"
            >
              <LogOut className="size-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.nav>
  );
}
