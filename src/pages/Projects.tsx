import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  Eye,
  FolderPlus,
  MoreHorizontal,
  Pencil,
  Search,
  Shield,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
} from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  createProject,
  deleteProject,
  fetchProjects,
  roleColors,
  statusColors,
  type Project,
  type ProjectFormData,
  type ProjectRole,
  type ProjectStatus,
  updateProject,
} from "../lib/api";
import { cn } from "../lib/utils";

const teamMembers = [
  "Nirvix",
  "Sarah",
  "Light",
  "Alisha",
  "Sujuna",
  "Ryuk",
  "Hak yeon",
];

const statuses: Array<ProjectStatus | "All"> = [
  "All",
  "Active",
  "Completed",
  "Upcoming",
  "On Hold",
];

const defaultFormData: ProjectFormData = {
  name: "",
  client: "",
  type: "",
  techStack: "",
  assignedTo: [],
  url: "",
  projectType: "",
  renewalDate: "",
  deadline: "",
  status: "Active",
  createdBy: "Admin",
};

const emptyProjects: Project[] = [];


const inputClassName =
  "border-slate-200/80 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950 focus-visible:ring-1 focus-visible:ring-blue-500/30 focus-visible:border-blue-400/50";

const sectionTitleClassName =
  "text-lg calistoga-regular text-slate-900 dark:text-slate-100";

const sectionEyebrowClassName =
  "text-[11px] trykker-regular uppercase tracking-[0.18em] text-slate-400";

const modalContentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const modalFieldVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

function ShadowCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`border-0 ring-0 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)] dark:bg-slate-900 dark:shadow-[0_18px_46px_rgba(2,6,23,0.32)] ${className}`}
    >
      {children}
    </Card>
  );
}

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

function ProjectsSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-40 rounded-lg" />
        <SkeletonBlock className="h-4 w-72 rounded-md" />
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SkeletonBlock className="h-10 w-full max-w-xl rounded-lg" />

        <div className="flex gap-3">
          <SkeletonBlock className="h-10 w-44 rounded-xl" />
          <SkeletonBlock className="h-10 w-44 rounded-xl" />
        </div>

        <SkeletonBlock className="h-10 w-32 rounded-lg" />
      </div>

      {/* Table container */}
      <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:bg-slate-900">
        {/* table header */}
        <div className="flex gap-4 border-b border-slate-200/70 dark:border-slate-800 px-5 py-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-3 w-20 rounded-md" />
          ))}
        </div>

        {/* rows */}
        <div className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
          {Array.from({ length: 6 }).map((_, row) => (
            <div key={row} className="flex gap-4 px-5 py-4">
              {Array.from({ length: 9 }).map((_, col) => (
                <SkeletonBlock
                  key={col}
                  className="h-4 flex-1 max-w-[120px] rounded-md"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} function MenuSelectField({
  value,
  options,
  onValueChange,
  className = "",
}: {
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-900 ${className}`}
        >
          <span className="truncate">{value}</span>
          <ChevronDown className="size-4 text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-48 rounded-xl border-0 ring-0 bg-white p-1.5 shadow-[0_16px_38px_rgba(15,23,42,0.12)] dark:bg-slate-900 dark:shadow-[0_18px_42px_rgba(2,6,23,0.42)]"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option}
              value={option}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 focus:bg-slate-100 dark:text-slate-100 dark:focus:bg-slate-800"
            >
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FilterDropdown({
  value,
  label,
  options,
  onValueChange,
  className = "",
}: {
  value: string;
  label: string;
  options: string[];
  onValueChange: (value: string) => void;
  className?: string;
}) {
  const selectedLabel =
    value === "All" ? label : value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`flex h-10 w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-900 ${className}`}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className="size-4 text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="rounded-xl border-0 ring-0 bg-white p-1.5 shadow-[0_16px_38px_rgba(15,23,42,0.12)] dark:bg-slate-900 dark:shadow-[0_18px_42px_rgba(2,6,23,0.42)]"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option}
              value={option}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 focus:bg-slate-100 dark:text-slate-100 dark:focus:bg-slate-800"
            >
              {option === "All" ? label : option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProjectModal({
  isOpen,
  mode,
  formData,
  title,
  onClose,
  onSubmit,
  onChange,
  onToggleMember,
}: {
  isOpen: boolean;
  mode: "create" | "edit" | "view";
  formData: ProjectFormData;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  onChange: <K extends keyof ProjectFormData>(field: K, value: ProjectFormData[K]) => void;
  onToggleMember: (member: string, checked: boolean) => void;
}) {
  if (!isOpen) {
    return null;
  }

  const selectedMembersLabel =
    formData.assignedTo.length > 0
      ? `${formData.assignedTo.length} member${formData.assignedTo.length > 1 ? "s" : ""} selected`
      : "Select team members";

  if (mode === "view") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[24px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] dark:bg-slate-900 dark:shadow-[0_34px_90px_rgba(2,6,23,0.72)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between px-6 pb-4 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-8 px-6 pb-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColors[formData.status]}`}>
                  {formData.status}
                </span>
                <span className="text-lg text-slate-500 dark:text-slate-400">
                  {formData.client || "No client added"}
                </span>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-[11px] trykker-regular uppercase tracking-[0.18em] text-slate-400">
                    Project Type
                  </p>
                  <p className="mt-2 text-lg text-slate-700 dark:text-slate-200">
                    {formData.projectType || "Not added"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-[11px] trykker-regular uppercase tracking-[0.18em] text-slate-400">
                    Deadline
                  </p>
                  <p className="mt-2 text-lg text-slate-700 dark:text-slate-200">
                    {formData.deadline || "Not set"}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[1.3rem] calistoga-regular text-slate-900 dark:text-slate-100">
                    Website URL
                  </h4>
                  <p className="mt-3 break-all text-[1rem] trykker-regular text-blue-600 dark:text-blue-400">
                    {formData.url || "Not added"}
                  </p>
                </div>

                <div>
                  <h4 className="text-[1.3rem] calistoga-regular text-slate-900 dark:text-slate-100">
                    Renewal Date
                  </h4>
                  <p className="mt-3 text-[1rem] trykker-regular text-slate-500 dark:text-slate-400">
                    {formData.renewalDate || "Not purchased yet"}
                  </p>
                </div>

                <div>
                  <h4 className="text-[1.3rem] calistoga-regular text-slate-900 dark:text-slate-100">
                    Technology Stack
                  </h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(formData.techStack || "")
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                      .map((item) => (
                        <span
                          key={item}
                          className="inline-flex rounded-xl bg-slate-100 px-3 py-2 text-sm trykker-regular text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {item}
                        </span>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[1.3rem] calistoga-regular text-slate-900 dark:text-slate-100">
                    Handled By
                  </h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.assignedTo.length > 0 ? (
                      formData.assignedTo.map((member) => (
                        <span
                          key={member}
                          className="inline-flex rounded-xl bg-slate-100 px-3 py-2 text-sm trykker-regular text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {member}
                        </span>
                      ))
                    ) : (
                      <p className="text-[1rem] trykker-regular text-slate-500 dark:text-slate-400">
                        No team member assigned
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-[1.3rem] calistoga-regular text-slate-900 dark:text-slate-100">
                    Type Of Website
                  </h4>
                  <p className="mt-3 max-w-3xl text-[1rem] leading-7 trykker-regular text-slate-600 dark:text-slate-300">
                    {formData.projectType || "No website type added"}
                  </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <h4 className="text-[1.3rem] calistoga-regular text-slate-900 dark:text-slate-100">
                      Created By
                    </h4>
                    <p className="mt-3 text-[1rem] trykker-regular text-slate-600 dark:text-slate-300">
                      {formData.createdBy}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[1.3rem] calistoga-regular text-slate-900 dark:text-slate-100">
                      Current Status
                    </h4>
                    <p className="mt-3 text-[1rem] trykker-regular text-slate-600 dark:text-slate-300">
                      {formData.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm md:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[30px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] dark:bg-slate-900 dark:shadow-[0_34px_90px_rgba(2,6,23,0.72)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="border-b border-slate-200/70 bg-transparent px-6 pb-5 pt-6 dark:border-slate-800/80">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div>
                  <h2 className="text-[2rem] calistoga-regular text-slate-900 dark:text-slate-50">
                    {title}
                  </h2>
                  <p className="mt-1 trykker-regular text-sm text-slate-500 dark:text-slate-400">
                    Update the project details, ownership, and delivery information.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          <motion.div
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 px-6 pb-6"
          >
            <motion.div variants={modalFieldVariants} className="rounded-[26px] bg-white p-6 dark:bg-slate-900">
              <div className="mb-5">
                <p className={sectionEyebrowClassName}>
                  Core Details
                </p>
                <h3 className={`mt-1 ${sectionTitleClassName}`}>
                  Project Identity
                </h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Name</Label>
                  <Input
                    id="project-name"
                    className={inputClassName}
                    value={formData.name}
                    onChange={(event) => onChange("name", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-client">Client</Label>
                  <Input
                    id="project-client"
                    className={inputClassName}
                    value={formData.client}
                    onChange={(event) => onChange("client", event.target.value)}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={modalFieldVariants} className="rounded-[26px] bg-white p-6 dark:bg-slate-900">
              <div className="mb-5">
                <p className={sectionEyebrowClassName}>
                  Technical Setup
                </p>
                <h3 className={`mt-1 ${sectionTitleClassName}`}>
                  Stack And Access
                </h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project-stack">Tech Stack (comma-separated)</Label>
                  <Input
                    id="project-stack"
                    className={inputClassName}
                    value={formData.techStack}
                    onChange={(event) => onChange("techStack", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Assigned To</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full cursor-pointer justify-between rounded-xl border-slate-200/80 bg-white font-normal text-slate-700 shadow-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <span className="truncate">{selectedMembersLabel}</span>
                        <ChevronDown className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="max-h-72 w-80 rounded-xl border-0 ring-0 bg-white p-2 shadow-[0_22px_48px_rgba(15,23,42,0.16)] dark:bg-slate-900 dark:shadow-[0_24px_54px_rgba(2,6,23,0.42)]"
                      align="start"
                    >
                      <DropdownMenuLabel>Team Members</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {teamMembers.map((member) => (
                        <DropdownMenuCheckboxItem
                          key={member}
                          className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 focus:bg-slate-100 hover:bg-slate-100 dark:text-slate-100 dark:focus:bg-slate-800 dark:hover:bg-slate-800"
                          checked={formData.assignedTo.includes(member)}
                          onCheckedChange={(checked) => onToggleMember(member, checked === true)}
                        >
                          {member}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {formData.assignedTo.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.assignedTo.map((member) => (
                        <button
                          key={member}
                          type="button"
                          onClick={() => onToggleMember(member, false)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          {member}
                          <X className="size-3" />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project-url">URL</Label>
                  <Input
                    id="project-url"
                    className={inputClassName}
                    value={formData.url}
                    onChange={(event) => onChange("url", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-type">Type Of Website</Label>
                  <Input
                    id="project-type"
                    className={inputClassName}
                    placeholder="News Portal"
                    value={formData.projectType}
                    onChange={(event) => onChange("projectType", event.target.value)}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={modalFieldVariants} className="rounded-[26px] bg-white p-6 dark:bg-slate-900">
              <div className="mb-5">
                <p className={sectionEyebrowClassName}>
                  Planning
                </p>
                <h3 className={`mt-1 ${sectionTitleClassName}`}>
                  Timeline And Ownership
                </h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project-renewal">Renewal Date</Label>
                  <Input
                    id="project-renewal"
                    type="date"
                    className={`${inputClassName} cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                    value={formData.renewalDate}
                    onChange={(event) => onChange("renewalDate", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-deadline">Deadline</Label>
                  <Input
                    id="project-deadline"
                    type="date"
                    className={`${inputClassName} cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                    value={formData.deadline}
                    onChange={(event) => onChange("deadline", event.target.value)}
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project-status">Status</Label>
                  <MenuSelectField
                    value={formData.status}
                    options={statuses.filter((status) => status !== "All")}
                    onValueChange={(value) => onChange("status", value as ProjectStatus)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="created-by">Created By</Label>
                  <MenuSelectField
                    value={formData.createdBy}
                    options={["Admin", "Manager"]}
                    onValueChange={(value) => onChange("createdBy", value as ProjectRole)}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={modalFieldVariants} className="flex justify-end gap-3 pt-1">
              <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer border-0 ring-0 shadow-none bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  className="cursor-pointer border-0 ring-0 shadow-none bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                  onClick={onSubmit}
                >
                  {mode === "create" ? "Create" : "Save Changes"}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Projects() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">("All");
  const [techFilter, setTechFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [modalTitle, setModalTitle] = useState("Create New Project");
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const projects = projectsQuery.data ?? emptyProjects;

  const isSaving =
    createProjectMutation.isPending || updateProjectMutation.isPending;

  const isLoading = projectsQuery.isLoading;
  const isError = projectsQuery.isError;

  const allLanguages = useMemo(() => {
    const languageSet = new Set<string>();

    projects.forEach((project) => {
      project.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => languageSet.add(item));
    });

    return Array.from(languageSet).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filteredProjects = projects.filter((project) => {
    const query = searchTerm.trim().toLowerCase();

    const matchesSearch =
      query.length === 0 ||
      project.name.toLowerCase().includes(query) ||
      project.client.toLowerCase().includes(query) ||
      project.projectType.toLowerCase().includes(query) ||
      project.techStack.toLowerCase().includes(query) ||
      project.assignedTo.some((member) =>
        member.toLowerCase().includes(query)
      );

    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;

    const matchesTech =
      techFilter === "All" ||
      project.techStack
        .split(",")
        .map((item) => item.trim())
        .includes(techFilter);

    return matchesSearch && matchesStatus && matchesTech;
  });

  const updateFormField = <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const toggleMember = (member: string, checked: boolean) => {
    setFormData((current) => ({
      ...current,
      assignedTo: checked
        ? [...current.assignedTo, member]
        : current.assignedTo.filter((item) => item !== member),
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setEditingProjectId(null);
    setModalTitle("Create New Project");
    setFormData(defaultFormData);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEditingProjectId(null);
    setModalTitle("Create New Project");
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const openProjectModal = (
    project: Project,
    mode: "edit" | "view" = "edit"
  ) => {
    const { id, updatedAt: _updatedAt, ...rest } = project;

    setModalMode(mode);
    setEditingProjectId(id);
    setModalTitle(mode === "view" ? project.name : "Edit Project");
    setFormData(rest);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const requiredFields = [
      formData.name.trim(),
      formData.client.trim(),
      formData.techStack.trim(),
      formData.url.trim(),
      formData.projectType.trim(),
    ];

    if (
      requiredFields.some((field) => !field) ||
      formData.assignedTo.length === 0
    ) {
      return;
    }

    if (modalMode === "create") {
      createProjectMutation.mutate(formData);
    } else if (editingProjectId !== null) {
      updateProjectMutation.mutate({
        id: editingProjectId,
        project: formData,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <ProjectsSkeleton />
      </div>
    );
  }

  //  ERROR STATE
  if (isError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="rounded-xl bg-rose-50 p-6 text-center text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">
          Could not load projects from the API. Start the Express server and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="space-y-4"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl calistoga-regular text-slate-800 dark:text-slate-100">
              Projects
            </h1>
            <p className="mt-1 trykker-regular text-slate-500 dark:text-slate-400">
              View and track all your active projects
            </p>
          </div>
        </div>
      </motion.div>

      {/* TABLE SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <ShadowCard className="overflow-hidden">
          <CardContent className="space-y-5">

            {/* SEARCH + FILTERS */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">

              {/* SEARCH */}
              <div className="relative flex-1 max-w-xl min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search projects, clients, domains, servers..."
                  className="h-10 w-full rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 pl-9 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-blue-500/30 focus-visible:border-blue-400/50"
                />
              </div>
              {/* CONTROLS */}
              <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:flex-nowrap lg:items-center">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <FilterDropdown
                    className="min-w-[190px]"
                    value={statusFilter}
                    label="All Status"
                    options={statuses}
                    onValueChange={(value) => setStatusFilter(value as ProjectStatus | "All")}
                  />

                  <FilterDropdown
                    className="min-w-[190px]"
                    value={techFilter}
                    label="All Tech"
                    options={["All", ...allLanguages]}
                    onValueChange={setTechFilter}
                  />
                </div>

                <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="rounded-lg border-slate-200/80 bg-slate-50 font-normal dark:border-slate-700 dark:bg-slate-800"
                    onClick={openCreateModal}
                  >
                    <FolderPlus className="size-4" />
                    Add Project
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:bg-slate-900">
              <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <table className="min-w-[1380px] w-full text-left">
                  <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:bg-slate-950/80 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-4 font-medium whitespace-nowrap">Project</th>
                      <th className="px-5 py-4 font-medium whitespace-nowrap">Client</th>
                      <th className="px-5 py-4 font-medium whitespace-nowrap">Type</th>
                      <th className="px-5 py-4 font-medium whitespace-nowrap">Tech Stack</th>
                      <th className="px-5 py-4 font-medium whitespace-nowrap">Assigned To</th>
                      <th className="px-5 py-4 font-medium whitespace-nowrap">Status</th>
                      <th className="px-5 py-4 font-medium whitespace-nowrap">Created By</th>
                      <th className="px-5 py-4 font-medium whitespace-nowrap">Deadline</th>
                      <th className="px-5 py-4 text-right font-medium whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>

                  <motion.tbody layout className="divide-y divide-slate-200/70 dark:divide-slate-800/80">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (

                        <motion.tr
                          key={project.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="align-top bg-white transition-colors hover:bg-slate-50/70 dark:bg-slate-900 dark:hover:bg-slate-950/70"
                        >
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-800 dark:text-slate-100">
                                {project.name}
                              </p>
                              <p className="text-sm leading-5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                {project.type}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-200 whitespace-nowrap">
                            {project.client}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-200 whitespace-nowrap">
                            {project.projectType}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-200 whitespace-nowrap">
                            {project.techStack}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex max-w-[320px] flex-wrap gap-1.5">
                              {project.assignedTo.map((member) => (
                                <span
                                  key={member}
                                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                  {member}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[project.status]}`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${roleColors[project.createdBy]}`}
                            >
                              {project.createdBy === "Admin" ? (
                                <Shield className="size-3.5" />
                              ) : (
                                <UserRound className="size-3.5" />
                              )}
                              {project.createdBy}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-200 whitespace-nowrap">
                            {project.deadline || "Not set"}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="ml-auto cursor-pointer rounded-xl border border-slate-200/80 text-slate-600 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-36 rounded-xl border-0 ring-0 bg-white p-1.5 shadow-[0_14px_34px_rgba(15,23,42,0.14)] dark:bg-slate-900 dark:shadow-[0_18px_40px_rgba(2,6,23,0.42)]"
                              >
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => openProjectModal(project, "view")}
                                >
                                  <Eye className="size-4" />
                                  Open
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => openProjectModal(project, "edit")}
                                >
                                  <Pencil className="size-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer text-rose-600 focus:text-rose-600"
                                  onSelect={(e) => { e.preventDefault(); setDeleteId(project.id); }}
                                >
                                  <Trash2 className="size-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center py-10">
                          No projects found
                        </td>
                      </tr>
                    )}
                  </motion.tbody>

                </table>
              </div>
            </div>

          </CardContent>
        </ShadowCard>
      </motion.div>

      <ProjectModal
        isOpen={isModalOpen}
        mode={modalMode}
        formData={formData}
        title={modalTitle}
        onClose={closeModal}
        onSubmit={isSaving ? () => { } : handleSubmit}
        onChange={updateFormField}
        onToggleMember={toggleMember}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{projects.find((p) => p.id === deleteId)?.name}</strong> will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => deleteId !== null && deleteProjectMutation.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  );
}
