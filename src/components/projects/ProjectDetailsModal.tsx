import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { statusColors, type Project } from "../../lib/projects";

export default function ProjectDetailsModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  if (!project) {
    return null;
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
          className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] dark:bg-slate-900 dark:shadow-[0_34px_90px_rgba(2,6,23,0.72)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between px-6 pb-4 pt-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[1.9rem] calistoga-regular text-slate-900 dark:text-slate-100">
                  {project.name}
                </h2>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm trykker-regular text-slate-500 dark:text-slate-400">
                {project.client}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-8 px-6 pb-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Type</p>
                <p className="mt-2 text-lg text-slate-700 dark:text-slate-200">{project.projectType || "Not added"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Deadline</p>
                <p className="mt-2 text-lg text-slate-700 dark:text-slate-200">{project.deadline || "Not set"}</p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Website URL</p>
                <p className="break-all text-base text-blue-600 dark:text-blue-400">{project.url || "Not added"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Renewal Date</p>
                <p className="text-base text-slate-600 dark:text-slate-300">{project.renewalDate || "Not set"}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((item) => (
                    <span
                      key={item}
                      className="inline-flex rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Assigned Team</p>
              <div className="flex flex-wrap gap-2">
                {project.assignedTo.length > 0 ? (
                  project.assignedTo.map((member) => (
                    <span
                      key={member}
                      className="inline-flex rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {member}
                    </span>
                  ))
                ) : (
                  <p className="text-base text-slate-500 dark:text-slate-400">No team member assigned</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Website Category</p>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{project.type || "Not added"}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Created By</p>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{project.createdBy}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Updated</p>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{project.updatedAt}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
