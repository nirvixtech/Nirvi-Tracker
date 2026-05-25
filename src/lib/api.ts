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

export type DeliveryStatus = "Active" | "Terminated" | "Delivered";

export type Domain = {
  id: number;
  domain: string;
  url: string;
  renewalDate: string | null;
  status: DeliveryStatus;
};

export type Server = {
  id: number;
  name: string;
  type: string;
  ipAddress: string;
  websites: number;
  status: string;
  statusDetail: string;
  domains: string[];
};

export type TeamProject = {
  name: string;
  description: string;
  status: "Active" | "Delivered" | "On Hold";
};

export type TeamMember = {
  name: string;
  role: string;
  title: string;
  email: string;
  color: string;
  skills: string[];
  projects: TeamProject[];
};

export type DashboardTrendPoint = {
  month: string;
  projects: number;
  tasks: number;
};

export type DashboardStatusPoint = {
  name: string;
  value: number;
  color: string;
};

export type DashboardResourcePoint = {
  name: string;
  count: number;
  change: number;
};

export type DashboardRecentProject = {
  name: string;
  status: "Ongoing" | "Completed" | "Upcoming";
  progress: number;
  updated: string;
};

export type DashboardData = {
  stats: {
    totalProjects: number;
    active: number;
    upcoming: number;
    completed: number;
  };
  trendData: DashboardTrendPoint[];
  statusData: DashboardStatusPoint[];
  resourceData: DashboardResourcePoint[];
  recentProjects: DashboardRecentProject[];
};

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

async function fetchJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(path, init);

  if (!response.ok) {
    throw new Error(`Request failed for ${path}`);
  }

  return (await response.json()) as T;
}

export function fetchProjects() {
  return fetchJson<Project[]>("/api/projects");
}

export function createProject(project: ProjectFormData) {
  return fetchJson<Project>("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });
}

export function updateProject({
  id,
  project,
}: {
  id: number;
  project: ProjectFormData;
}) {
  return fetchJson<Project>(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });
}

export function fetchDomains() {
  return fetchJson<Domain[]>("/api/domains");
}

export function createDomain(domain: Omit<Domain, "id">) {
  return fetchJson<Domain>("/api/domains", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(domain),
  });
}

export function deleteProject(id: number) {
  return fetchJson<{ ok: boolean }>(`/api/projects/${id}`, { method: "DELETE" });
}

export function updateDomain({ id, domain }: { id: number; domain: Omit<Domain, "id"> }) {
  return fetchJson<Domain>(`/api/domains/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(domain),
  });
}

export function deleteDomain(id: number) {
  return fetchJson<{ ok: boolean }>(`/api/domains/${id}`, { method: "DELETE" });
}

export function fetchServers() {
  return fetchJson<Server[]>("/api/servers");
}

export function createServer(server: Omit<Server, "id">) {
  return fetchJson<Server>("/api/servers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(server),
  });
}

export function updateServer({ id, server }: { id: number; server: Omit<Server, "id"> }) {
  return fetchJson<Server>(`/api/servers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(server),
  });
}

export function deleteServer(id: number) {
  return fetchJson<{ ok: boolean }>(`/api/servers/${id}`, { method: "DELETE" });
}

export function fetchTeam() {
  return fetchJson<TeamMember[]>("/api/team");
}

export function fetchDashboard() {
  return fetchJson<DashboardData>("/api/dashboard");
}
