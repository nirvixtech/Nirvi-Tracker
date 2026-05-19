import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  Shield,
  Code,
  Palette,
  Check,
  X,
  Users,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { fetchTeam, type TeamMember } from "../lib/api";

/* ─── Mock Team Data ─── */
const roles = [
  { label: "Admin", value: "admin", icon: Shield },
  { label: "Developer", value: "developer", icon: Code },
  { label: "Designer", value: "designer", icon: Palette },
];

/* ─── Scroll Reveal ─── */
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Member Detail Modal ─── */
function MemberModal({
  member,
  onClose,
}: {
  member: TeamMember;
  onClose: () => void;
}) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center size-16 rounded-full ${member.color} text-white text-xl font-bold calistoga-regular shadow-lg`}
            >
              {initials}
            </div>
            <div>
              <h2 className="text-lg calistoga-regular text-slate-800 dark:text-slate-100">
                {member.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 trykker-regular mt-0.5">
                {member.title}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 trykker-regular mt-0.5">
                {member.email}
              </p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="px-6 pb-2">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 trykker-regular">
              Skills
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 trykker-regular border border-slate-200 dark:border-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="size-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 trykker-regular">
              Assigned Projects ({member.projects.length})
            </h3>
          </div>
          <div className="space-y-2.5">
            {member.projects.map((project) => (
              <div
                key={project.name}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 dark:border-slate-700/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 trykker-regular">
                    {project.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 trykker-regular mt-0.5">
                    {project.description}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full trykker-regular shrink-0 ${project.status === "Active"
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                    : project.status === "Delivered"
                      ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                      : "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                    }`}
                >
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Member Card ─── */
function MemberCard({
  member,
  delay,
  onClick,
}: {
  member: TeamMember;
  delay: number;
  onClick: () => void;
}) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <ScrollReveal delay={delay}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={onClick}
      >
        <Card className="ring-0 shadow-sm hover:shadow-lg transition-shadow duration-300 border-slate-200/60 dark:border-slate-700/90 dark:bg-slate-900/85 dark:shadow-black/20 cursor-pointer overflow-hidden">
          <div className="h-1.5 w-full " />
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center size-12 rounded-xl ${member.color} text-white text-sm font-bold calistoga-regular dark:group-hover transition-colors duration-300`}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 trykker-regular truncate">
                  {member.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 trykker-regular mt-0.5">
                  {member.email}
                </p>
                <span
                  className={`inline-block mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full trykker-regular ${member.role === "Admin"
                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                    : member.role === "Developer"
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                    }`}
                >
                  {member.role}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-x text-slate-400 dark:text-slate-500 trykker-regular">
              <Briefcase className="size-4" />
              {member.projects.length} projects
            </div>
            <div className="mt-2 px-3 py-2 ">
              <span className="shrink-0 font-medium text-slate-600 dark:text-slate-200 rounded-lg border border-slate-200/80 bg-slate-50 dark:border-slate-700/80 dark:bg-slate-800/70 gap-1.5 text-xs trykker-regular p-1">
                Skills:
              </span>

              <div className="flex gap-1.5 mt-3 text-xs text-slate-500 dark:text-slate-300/90 trykker-regular">
                <p className="line-clamp-2">
                  {member.skills.join(" • ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </ScrollReveal>
  );
}

/* ─── Invite Card ─── */
function InviteCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("developer");
  const [sendWelcome, setSendWelcome] = useState(true);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success(`Invitation sent to ${name} at ${email}`);
    setName("");
    setEmail("");
  };

  return (
    <ScrollReveal delay={0.15}>
      <motion.div>
        <Card className="ring-0 shadow-sm border-slate-200/60 dark:border-slate-800 overflow-hidden">
          <div className="h-1.5 w-full" />
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                <Mail className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base calistoga-regular text-slate-800 dark:text-slate-100">
                  Invite New Member
                </CardTitle>
                <CardDescription className="trykker-regular">
                  Send a welcome email to a team member                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs trykker-regular text-slate-500 dark:text-slate-400">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-blue-500/30 focus-visible:border-blue-400/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs trykker-regular text-slate-500 dark:text-slate-400">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-blue-500/30 focus-visible:border-blue-400/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs trykker-regular text-slate-500 dark:text-slate-400">
                  Assign Role
                </Label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.value;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setSelectedRole(role.value)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 trykker-regular ${isSelected
                          ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                      >
                        <Icon className="size-4" />
                        {role.label}
                        {isSelected && <Check className="size-3.5 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="welcome"
                    checked={sendWelcome}
                    onChange={(event) => setSendWelcome(event.currentTarget.checked)}
                    className="rounded border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label
                    htmlFor="welcome"
                    className="text-sm text-slate-700 dark:text-slate-200 trykker-regular cursor-pointer"
                  >
                    Send welcome email
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="h-10 px-5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.97] transition-all cursor-pointer border-0 flex items-center gap-2"
                >
                  <Send className="size-4" />
                  <span className="trykker-regular">Send Invitation</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </ScrollReveal>
  );
}

/* ─── Skeleton ─── */
function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80 ${className}`} />;
}

function TeamSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-20 rounded-lg" />
          <SkeletonBlock className="h-4 w-72 rounded-md" />
        </div>
        <SkeletonBlock className="hidden sm:block h-8 w-28 rounded-lg" />
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-10 w-10 rounded-xl" />
          <div className="space-y-1.5">
            <SkeletonBlock className="h-5 w-36 rounded-md" />
            <SkeletonBlock className="h-3 w-52 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkeletonBlock className="h-10 rounded-lg" />
          <SkeletonBlock className="h-10 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <SkeletonBlock className="h-9 w-24 rounded-lg" />
          <SkeletonBlock className="h-9 w-28 rounded-lg" />
          <SkeletonBlock className="h-9 w-24 rounded-lg" />
        </div>
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-5 w-40 rounded-md" />
          <SkeletonBlock className="h-10 w-36 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-white shadow-sm border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 p-5 space-y-4"
          >
            <div className="flex items-center gap-4">
              <SkeletonBlock className="size-12 rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <SkeletonBlock className="h-4 w-32 rounded-md" />
                <SkeletonBlock className="h-3 w-40 rounded-md" />
                <SkeletonBlock className="h-4 w-16 rounded-full" />
              </div>
            </div>
            <SkeletonBlock className="h-4 w-24 rounded-md" />
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-12 rounded-md" />
              <SkeletonBlock className="h-4 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Team Page ─── */
export default function Team() {
  const teamQuery = useQuery({
    queryKey: ["team"],
    queryFn: fetchTeam,
  });
  const isLoading = teamQuery.isLoading;
  const isError = teamQuery.isError;
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const teamMembers = teamQuery.data ?? [];

  if (isLoading) {
    return <TeamSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="rounded-xl bg-rose-50 p-6 text-center text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">
          Could not load team data from the API. Start the Express server and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <ScrollReveal>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl calistoga-regular text-slate-800 dark:text-slate-100">
              Team
            </h1>
            <p className="trykker-regular text-slate-500 dark:text-slate-400 mt-1">
              Meet our talented team members and their expertise.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-sm trykker-regular">
            <Users className="size-4" />
            {teamMembers.length} members
          </div>
        </div>
      </ScrollReveal>

      {/* Invite Card */}
      <InviteCard />

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member, idx) => (
          <MemberCard
            key={member.email}
            member={member}
            delay={idx * 0.08}
            onClick={() => setSelectedMember(member)}
          />
        )
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMember && (
          <MemberModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
