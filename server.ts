import cors from "cors";
import express, { type Request, type Response } from "express";

type ProjectStatus = "Active" | "Completed" | "Upcoming" | "On Hold";
type ProjectRole = "Admin" | "Manager";

type Project = {
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

type ProjectInput = Omit<Project, "id" | "updatedAt">;

type DeliveryStatus = "Active" | "Terminated" | "Delivered";

type Domain = {
  id: number;
  domain: string;
  url: string;
  renewalDate: string | null;
  status: DeliveryStatus;
};

type Server = {
  id: number;
  name: string;
  type: string;
  ipAddress: string;
  websites: number;
  status: string;
  statusDetail: string;
  domains: string[];
};

type TeamProject = {
  name: string;
  description: string;
  status: "Active" | "Delivered" | "On Hold";
};

type TeamMember = {
  name: string;
  role: string;
  title: string;
  email: string;
  color: string;
  skills: string[];
  projects: TeamProject[];
};

type DashboardTrendPoint = {
  month: string;
  projects: number;
  tasks: number;
};

type DashboardStatusPoint = {
  name: string;
  value: number;
  color: string;
};

type DashboardResourcePoint = {
  name: string;
  count: number;
  change: number;
};

type DashboardRecentProject = {
  name: string;
  status: "Ongoing" | "Completed" | "Upcoming";
  progress: number;
  updated: string;
};

const app = express();
const port = 5000;

let projects: Project[] = [
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

let domains: Domain[] = [
  {
    id: 1,
    domain: "damaruresources.com",
    url: "https://damaruresources.com",
    renewalDate: "2026-06-01",
    status: "Active",
  },
  {
    id: 2,
    domain: "ainaatv.com",
    url: "https://ainaatv.com",
    renewalDate: "2026-03-05",
    status: "Terminated",
  },
  {
    id: 3,
    domain: "serophereonline.com",
    url: "https://serophereonline.com",
    renewalDate: "2026-04-21",
    status: "Terminated",
  },
  {
    id: 4,
    domain: "globalrisingtravel.com",
    url: "https://globalrisingtravel.com",
    renewalDate: "2026-09-01",
    status: "Active",
  },
  {
    id: 5,
    domain: "sukiloproperties.ae",
    url: "https://sukiloproperties.ae",
    renewalDate: "2026-08-11",
    status: "Active",
  },
  {
    id: 6,
    domain: "zencareerhub.ae",
    url: "https://zencareerhub.ae",
    renewalDate: "2026-04-12",
    status: "Delivered",
  },
];

let servers: Server[] = [
  {
    id: 1,
    name: "Agni Server",
    type: "Server",
    ipAddress: "135.181.141.188",
    websites: 8,
    status: "Active",
    statusDetail: "Server running",
    domains: [
      "ainaatv.com",
      "damaruresources.com",
      "globalrisingtravel.com",
      "sukiloproperties.ae",
      "zencareerhub.ae",
      "levelup.edu.np",
      "deeptech.com.np",
      "serophereonline.com",
    ],
  },
  {
    id: 2,
    name: "C5 Server",
    type: "Server",
    ipAddress: "198.251.89.34",
    websites: 1,
    status: "Active",
    statusDetail: "Server running",
    domains: ["ekathas.com"],
  },
];

const teamMembers: TeamMember[] = [
  {
    name: "Nirvix",
    role: "Admin",
    title: "Founder & Lead Developer",
    email: "nirvix@nirvi.dev",
    color: "bg-blue-500",
    skills: ["React", "Node.js", "System Design", "DevOps"],
    projects: [
      { name: "Nirvi Track", description: "Project Tracker Platform", status: "Active" },
      { name: "Ainaa TV", description: "News Portal", status: "Delivered" },
      { name: "Serophero Online", description: "News Portal", status: "Active" },
    ],
  },
  {
    name: "Sarah",
    role: "Developer",
    title: "Senior Full Stack Engineer",
    email: "sarah@nirvi.dev",
    color: "bg-emerald-500",
    skills: ["TypeScript", "Python", "AWS", "PostgreSQL"],
    projects: [
      { name: "E-Commerce API", description: "Backend Microservices", status: "Active" },
      { name: "CRM Dashboard", description: "Internal Tools", status: "Active" },
      { name: "Analytics Engine", description: "Data Pipeline", status: "On Hold" },
    ],
  },
  {
    name: "Ryuk",
    role: "Developer",
    title: "Backend Specialist",
    email: "marcus@nirvi.dev",
    color: "bg-violet-500",
    skills: ["Go", "Rust", "Docker", "Kubernetes"],
    projects: [
      { name: "Global Rising Travel", description: "Tours & Travel", status: "Active" },
      { name: "Zen Career Hub", description: "Job Portal", status: "Delivered" },
    ],
  },
  {
    name: "Alisha",
    role: "Designer",
    title: "UI/UX Lead",
    email: "aisha@nirvi.dev",
    color: "bg-amber-500",
    skills: ["Figma", "Motion Design", "Design Systems", "User Research"],
    projects: [
      { name: "Portfolio Redesign", description: "Creative Agency Site", status: "Delivered" },
      { name: "Serophero Online", description: "News Portal", status: "Active" },
    ],
  },
  {
    name: "Light",
    role: "Designer",
    title: "Product Designer",
    email: "james@nirvi.dev",
    color: "bg-rose-500",
    skills: ["Adobe XD", "Illustration", "Prototyping", "Branding"],
    projects: [
      { name: "Ainaa TV", description: "News Portal Rebrand", status: "Delivered" },
      { name: "Nirvi Track", description: "Dashboard UI", status: "Active" },
    ],
  },
];

const trendData: DashboardTrendPoint[] = [
  { month: "Jan", projects: 4, tasks: 24 },
  { month: "Feb", projects: 6, tasks: 32 },
  { month: "Mar", projects: 8, tasks: 45 },
  { month: "Apr", projects: 5, tasks: 38 },
  { month: "May", projects: 9, tasks: 52 },
  { month: "Jun", projects: 12, tasks: 64 },
];

function buildDashboardData() {
  const activeCount = projects.filter((project) => project.status === "Active").length;
  const upcomingCount = projects.filter((project) => project.status === "Upcoming").length;
  const completedCount = projects.filter((project) => project.status === "Completed").length;
  const onHoldCount = projects.filter((project) => project.status === "On Hold").length;

  const resourceData: DashboardResourcePoint[] = [
    { name: "Servers", count: servers.length * 4, change: 2 },
    { name: "Domains", count: domains.length, change: 3 },
    { name: "Team", count: teamMembers.length, change: 0 },
  ];

  const statusData: DashboardStatusPoint[] = [
    { name: "Completed", value: completedCount, color: "#3b82f6" },
    { name: "Ongoing", value: activeCount, color: "#f59e0b" },
    { name: "Upcoming", value: upcomingCount, color: "#10b981" },
    { name: "On Hold", value: onHoldCount, color: "#ef4444" },
  ];

  const recentProjects: DashboardRecentProject[] = projects.slice(0, 4).map((project, index) => ({
    name: project.name,
    status:
      project.status === "Completed"
        ? "Completed"
        : project.status === "Upcoming"
          ? "Upcoming"
          : "Ongoing",
    progress:
      project.status === "Completed"
        ? 100
        : project.status === "Upcoming"
          ? 0
          : [72, 45, 58, 64][index] ?? 50,
    updated: project.updatedAt,
  }));

  return {
    stats: {
      totalProjects: projects.length,
      active: activeCount,
      upcoming: upcomingCount,
      completed: completedCount,
    },
    trendData,
    statusData,
    resourceData,
    recentProjects,
  };
}

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/api/projects", (_req: Request, res: Response<Project[]>) => {
  res.json(projects);
});

app.get("/api/domains", (_req: Request, res: Response<Domain[]>) => {
  res.json(domains);
});

app.post("/api/domains", (req: Request, res: Response) => {
  const payload = req.body as Partial<Domain>;

  if (!payload.domain || !payload.url || !payload.renewalDate || !payload.status) {
    res.status(400).json({ message: "Missing required domain fields." });
    return;
  }

  const domain: Domain = {
    id: Date.now(),
    domain: payload.domain,
    url: payload.url,
    renewalDate: payload.renewalDate,
    status: payload.status,
  };

  domains = [domain, ...domains];
  res.status(201).json(domain);
});

app.get("/api/servers", (_req: Request, res: Response<Server[]>) => {
  res.json(servers);
});

app.get("/api/team", (_req: Request, res: Response<TeamMember[]>) => {
  res.json(teamMembers);
});

app.get("/api/dashboard", (_req: Request, res: Response) => {
  res.json(buildDashboardData());
});

app.post("/api/projects", (req: Request, res: Response) => {
  const payload = req.body as Partial<ProjectInput>;

  if (!payload.name || !payload.client || !payload.techStack || !payload.projectType || !payload.url) {
    res.status(400).json({ message: "Missing required project fields." });
    return;
  }

  const project: Project = {
    id: Date.now(),
    name: payload.name,
    client: payload.client,
    type: payload.type ?? "",
    techStack: payload.techStack,
    assignedTo: Array.isArray(payload.assignedTo) ? payload.assignedTo : [],
    url: payload.url,
    projectType: payload.projectType,
    renewalDate: payload.renewalDate ?? "",
    deadline: payload.deadline ?? "",
    status: payload.status ?? "Active",
    createdBy: payload.createdBy ?? "Admin",
    updatedAt: "Just now",
  };

  projects = [project, ...projects];
  res.status(201).json(project);
});

app.put("/api/projects/:id", (req: Request, res: Response) => {
  const projectId = Number(req.params.id);
  const payload = req.body as Partial<ProjectInput>;
  const currentProject = projects.find((project) => project.id === projectId);

  if (!currentProject) {
    res.status(404).json({ message: "Project not found." });
    return;
  }

  const updatedProject: Project = {
    ...currentProject,
    ...payload,
    updatedAt: "Just now",
  };

  projects = projects.map((project) => (project.id === projectId ? updatedProject : project));
  res.json(updatedProject);
});

app.delete("/api/projects/:id", (req: Request, res: Response) => {
  const projectId = Number(req.params.id);
  const exists = projects.some((project) => project.id === projectId);

  if (!exists) {
    res.status(404).json({ message: "Project not found." });
    return;
  }

  projects = projects.filter((project) => project.id !== projectId);
  res.json({ ok: true });
});

app.put("/api/domains/:id", (req: Request, res: Response) => {
  const domainId = Number(req.params.id);
  const payload = req.body as Partial<Omit<Domain, "id">>;
  const currentDomain = domains.find((domain) => domain.id === domainId);

  if (!currentDomain) {
    res.status(404).json({ message: "Domain not found." });
    return;
  }

  const updatedDomain: Domain = { ...currentDomain, ...payload };
  domains = domains.map((domain) => (domain.id === domainId ? updatedDomain : domain));
  res.json(updatedDomain);
});

app.delete("/api/domains/:id", (req: Request, res: Response) => {
  const domainId = Number(req.params.id);
  const exists = domains.some((domain) => domain.id === domainId);

  if (!exists) {
    res.status(404).json({ message: "Domain not found." });
    return;
  }

  domains = domains.filter((domain) => domain.id !== domainId);
  res.json({ ok: true });
});

app.post("/api/servers", (req: Request, res: Response) => {
  const payload = req.body as Partial<Omit<Server, "id">>;

  if (!payload.name || !payload.ipAddress) {
    res.status(400).json({ message: "Missing required server fields." });
    return;
  }

  const server: Server = {
    id: Date.now(),
    name: payload.name,
    type: payload.type ?? "Server",
    ipAddress: payload.ipAddress,
    websites: payload.websites ?? 0,
    status: payload.status ?? "Active",
    statusDetail: payload.statusDetail ?? "",
    domains: Array.isArray(payload.domains) ? payload.domains : [],
  };

  servers = [server, ...servers];
  res.status(201).json(server);
});

app.put("/api/servers/:id", (req: Request, res: Response) => {
  const serverId = Number(req.params.id);
  const payload = req.body as Partial<Omit<Server, "id">>;
  const currentServer = servers.find((server) => server.id === serverId);

  if (!currentServer) {
    res.status(404).json({ message: "Server not found." });
    return;
  }

  const updatedServer: Server = { ...currentServer, ...payload };
  servers = servers.map((server) => (server.id === serverId ? updatedServer : server));
  res.json(updatedServer);
});

app.delete("/api/servers/:id", (req: Request, res: Response) => {
  const serverId = Number(req.params.id);
  const exists = servers.some((server) => server.id === serverId);

  if (!exists) {
    res.status(404).json({ message: "Server not found." });
    return;
  }

  servers = servers.filter((server) => server.id !== serverId);
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
