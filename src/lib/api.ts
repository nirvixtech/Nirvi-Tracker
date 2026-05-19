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
  active: "Active";
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

export function fetchServers() {
  return fetchJson<Server[]>("/api/servers");
}

export function fetchTeam() {
  return fetchJson<TeamMember[]>("/api/team");
}

export function fetchDashboard() {
  return fetchJson<DashboardData>("/api/dashboard");
}
