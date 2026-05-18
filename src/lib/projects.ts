import { useEffect, useState } from "react";

export type ProjectStatus = "Active" | "Completed" | "Upcoming" | "On Hold";
export type ProjectRole = "Admin" | "Manager";

export type Project = {
  id: number;
  name: string;
  client: string;
  type: string;
  techStack: string;
  assignedTo: string[];
  url: string;
  projectType: string;
  renewalDate: string;
  deadline: string;
  status: ProjectStatus;
  createdBy: ProjectRole;
  updatedAt: string;
};

export type ProjectFormData = Omit<Project, "id" | "updatedAt">;

export const teamMembers = [
  "Nirvix",
  "Sarah",
  "Light",
  "Alisha",
  "Sujuna",
  "Ryuk",
  "Hak yeon",
];

export const statuses: Array<ProjectStatus | "All"> = [
  "All",
  "Active",
  "Completed",
  "Upcoming",
  "On Hold",
];

export const defaultFormData: ProjectFormData = {
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

export const initialProjects: Project[] = [
  {
    id: 1,
    name: "Ainaa TV",
    client: "Ainaa Media",
    type: "Consultancy website",
    techStack: "WordPress, PHP, MySQL",
    assignedTo: ["Hak yeon", "Alisha", "Light"],
    url: "https://ainaatv.com",
    projectType: "News Portal",
    renewalDate: "2026-08-05",
    deadline: "2026-06-10",
    status: "Active",
    createdBy: "Admin",
    updatedAt: "Today",
  },
  {
    id: 2,
    name: "Global Rising Travel",
    client: "Global Rising",
    type: "Consultancy website",
    techStack: "React, Node.js, PostgreSQL",
    assignedTo: ["Nirvix", "Light"],
    url: "https://globalrisingtravel.com",
    projectType: "Tours & Travel",
    renewalDate: "2026-11-20",
    deadline: "2026-07-01",
    status: "Upcoming",
    createdBy: "Manager",
    updatedAt: "2 days ago",
  },
  {
    id: 3,
    name: "Nirvi Tracker",
    client: "Internal",
    type: "Consultancy website",
    techStack: "React, TypeScript, Tailwind",
    assignedTo: ["Sujuna", "Ryuk"],
    url: "https://tracker.nirvi.com",
    projectType: "Internal Tool",
    renewalDate: "2027-01-15",
    deadline: "2026-05-30",
    status: "Active",
    createdBy: "Admin",
    updatedAt: "Just now",
  },
];

export const statusColors: Record<ProjectStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  Completed: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  Upcoming: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  "On Hold": "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
};

export const roleColors: Record<ProjectRole, string> = {
  Admin: "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900",
  Manager: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
};

const PROJECTS_STORAGE_KEY = "nirvi-tracker-projects";

function readStoredProjects() {
  if (typeof window === "undefined") {
    return initialProjects;
  }

  const storedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY);

  if (!storedProjects) {
    return initialProjects;
  }

  try {
    const parsedProjects = JSON.parse(storedProjects) as Project[];
    return Array.isArray(parsedProjects) ? parsedProjects : initialProjects;
  } catch {
    return initialProjects;
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(readStoredProjects);

  useEffect(() => {
    window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  return [projects, setProjects] as const;
}
