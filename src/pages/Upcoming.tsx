import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import ProjectDetailsModal from "../components/projects/ProjectDetailsModal";
import { statusColors } from "../lib/projects";
import { fetchProjects, type Project } from "../lib/api";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80 ${className}`} />;
}

function UpcomingSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-52 rounded-lg" />
        <SkeletonBlock className="h-4 w-80 rounded-md" />
      </div>

      <SkeletonBlock className="h-10 w-full max-w-xl rounded-lg" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08),0_4px_14px_rgba(15,23,42,0.05)] dark:bg-slate-900 p-5 space-y-5"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-5 w-36 rounded-md" />
                <SkeletonBlock className="h-5 w-16 rounded-full" />
              </div>
              <SkeletonBlock className="h-4 w-28 rounded-md" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <SkeletonBlock className="h-3 w-8 rounded-sm" />
                <SkeletonBlock className="h-4 w-24 rounded-md" />
              </div>
              <div className="space-y-1">
                <SkeletonBlock className="h-3 w-16 rounded-sm" />
                <SkeletonBlock className="h-4 w-24 rounded-md" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <SkeletonBlock className="h-3 w-20 rounded-sm" />
                <SkeletonBlock className="h-4 w-48 rounded-md" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <SkeletonBlock className="h-3 w-16 rounded-sm" />
                <SkeletonBlock className="h-4 w-40 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Upcoming() {
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const isLoading = projectsQuery.isLoading;
  const isError = projectsQuery.isError;
  const projects = projectsQuery.data ?? [];
  const upcomingProjects = projects.filter((project) => {
    if (project.status !== "Upcoming") {
      return false;
    }

    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      project.name.toLowerCase().includes(query)
      || project.client.toLowerCase().includes(query)
      || project.projectType.toLowerCase().includes(query)
      || project.techStack.toLowerCase().includes(query)
      || project.assignedTo.some((member) => member.toLowerCase().includes(query))
    );
  });

  if (isLoading) {
    return <UpcomingSkeleton />;
  }

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
      <div>
        <h1 className="text-2xl calistoga-regular text-slate-800 dark:text-slate-100">Upcoming Projects</h1>
        <p className="mt-1 trykker-regular text-slate-500 dark:text-slate-400">
          Track potential projects and new business opportunities.
        </p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search upcoming projects..."
          className="h-10 rounded-lg border-slate-200/80 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 focus-visible:border-blue-400/50 focus-visible:ring-1 focus-visible:ring-blue-500/30"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {upcomingProjects.length > 0 ? (
          upcomingProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.24 }}
            >
              <Card
                className="h-full cursor-pointer border-0 ring-0 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08),0_4px_14px_rgba(15,23,42,0.05)] transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12),0_8px_20px_rgba(15,23,42,0.08)] dark:bg-slate-900 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:hover:shadow-[0_26px_70px_rgba(2,6,23,0.36)]"
                onClick={() => setSelectedProject(project)}
              >
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {project.name}
                      </h2>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {project.client}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Type</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200">{project.projectType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Deadline</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200">{project.deadline || "Not set"}</p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Tech Stack</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200">{project.techStack}</p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Assigned</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        {project.assignedTo.join(", ") || "Nobody assigned"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 md:col-span-2 xl:col-span-3">
            No upcoming projects found. Set a project status to `Upcoming` in Projects and it will appear here.
          </div>
        )}
      </div>

      <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
