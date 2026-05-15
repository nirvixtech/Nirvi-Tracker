import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Server, X } from "lucide-react";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

type ServerRow = {
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

const servers: ServerRow[] = [
  {
    id: 1,
    name: "Agni Server",
    type: "Server",
    ipAddress: "135.181.141.188",
    websites: 8,
    status: "Active",
    statusDetail: "Server running",
    active: "Active",
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
    active: "Active",
    domains: ["ekathas.com"],
  },
];

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

export default function Servers() {
  const [selectedServer, setSelectedServer] = useState<ServerRow | null>(null);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="space-y-2"
      >
        <h1 className="text-2xl calistoga-regular text-slate-800 dark:text-slate-100">
          Servers
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <ShadowCard className="overflow-hidden rounded-[20px]">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Server className="size-4" />
              </div>
              <h2 className="text-xl calistoga-regular text-slate-900 dark:text-slate-100">
                Live Server List
              </h2>
            </div>

            <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="min-w-[1020px] w-full text-left">
                <thead className="text-sm text-slate-500 dark:text-slate-400">
                  <tr className="border-b border-slate-200/80 dark:border-slate-800/80">
                    <th className="px-2 py-4 font-medium">Server Name</th>
                    <th className="px-2 py-4 font-medium">Type</th>
                    <th className="px-2 py-4 font-medium">IP Address</th>
                    <th className="px-2 py-4 font-medium">Domains</th>
                    <th className="px-2 py-4 font-medium">Websites</th>
                    <th className="px-2 py-4 font-medium">Status</th>
                    <th className="px-2 py-4 font-medium">Linked Total</th>
                    <th className="px-2 py-4 font-medium">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {servers.map((server) => (
                    <tr
                      key={server.id}
                      className="border-b border-slate-200/70 align-top transition-colors hover:bg-slate-50/60 dark:border-slate-800/80 dark:hover:bg-slate-950/60"
                    >
                      <td className="px-2 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                        {server.name}
                      </td>
                      <td className="px-2 py-4">
                        <span className="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                          {server.type}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-sm tracking-[0.12em] text-slate-800 dark:text-slate-200">
                        {server.ipAddress}
                      </td>
                      <td className="px-2 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedServer(server)}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          <span>
                            {server.domains.length} domain{server.domains.length > 1 ? "s" : ""}
                          </span>
                          <span className="text-slate-400">Inspect</span>
                        </button>
                      </td>
                      <td className="px-2 py-4">
                        <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                          {server.websites} website{server.websites > 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-2 py-4">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {server.status}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {server.statusDetail}
                          </p>
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {server.domains.length} domain{server.domains.length > 1 ? "s" : ""}
                        </p>
                      </td>
                      <td className="px-2 py-4">
                        <span className="inline-flex rounded-xl bg-emerald-100 px-4 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                          {server.active}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </ShadowCard>
      </motion.div>

      <AnimatePresence>
        {selectedServer ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
            onClick={() => setSelectedServer(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)] dark:bg-slate-900 dark:shadow-[0_34px_90px_rgba(2,6,23,0.72)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] trykker-regular uppercase tracking-[0.18em] text-slate-400">
                    Attached Domains
                  </p>
                  <h3 className="mt-2 text-xl calistoga-regular text-slate-900 dark:text-slate-100">
                    {selectedServer.name}
                  </h3>
                  <p className="mt-2 text-sm trykker-regular text-slate-500 dark:text-slate-400">
                    {selectedServer.ipAddress} • {selectedServer.domains.length} mapped domain
                    {selectedServer.domains.length > 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedServer(null)}
                  className="cursor-pointer rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {selectedServer.domains.map((domain) => (
                  <div
                    key={domain}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{domain}</p>
                    <a
                      href={`https://${domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Open website
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
