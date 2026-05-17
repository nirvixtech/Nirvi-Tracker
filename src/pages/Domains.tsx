import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink } from "lucide-react";

import { Card, CardContent } from "../components/ui/card";

type DeliveryStatus = "Active" | "Delivered";

type DomainRow = {
  id: number;
  domain: string;
  url: string;
  renewalDate: string | null;
  renewalLabel?: string;
  status: DeliveryStatus;
  accent?: "warning";
};

const today = new Date("2026-05-15T00:00:00");

const domains: DomainRow[] = [
  {
    id: 1,
    domain: "damaruresources.com",
    url: "https://damaruresources.com",
    renewalDate: "2026-06-01",
    status: "Active",
  },
  {
    id: 3,
    domain: "ainaatv.com",
    url: "https://ainaatv.com",
    renewalDate: "2026-03-05",
    status: "Active",
    accent: "warning",
  },
  {
    id: 4,
    domain: "serophereonline.com",
    url: "https://serophereonline.com",
    renewalDate: "2026-04-21",
    status: "Active",
  },
  {
    id: 5,
    domain: "globalrisingtravel.com",
    url: "https://globalrisingtravel.com",
    renewalDate: "2026-09-01",
    status: "Active",
  },
  {
    id: 6,
    domain: "sukiloproperties.ae",
    url: "https://sukiloproperties.ae",
    renewalDate: "2026-08-11",
    status: "Active",
  },
  {
    id: 7,
    domain: "zencareerhub.ae",
    url: "https://zencareerhub.ae",
    renewalDate: "2026-04-12",
    status: "Delivered",
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

function formatRenewalDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function getDaysRemaining(value: string | null) {
  if (!value) {
    return null;
  }

  const renewalDate = new Date(`${value}T00:00:00`);
  return Math.ceil((renewalDate.getTime() - today.getTime()) / 86400000);
}

function getProgressWidth(daysRemaining: number | null) {
  if (daysRemaining === null || daysRemaining <= 0) {
    return "0%";
  }

  return `${Math.min((daysRemaining / 140) * 100, 100)}%`;
}

function getProgressColor(daysRemaining: number | null) {
  if (daysRemaining === null || daysRemaining <= 0) {
    return "bg-slate-300 dark:bg-slate-600";
  }

  if (daysRemaining <= 90) {
    return "bg-orange-500";
  }

  return "bg-emerald-500";
}

export default function Domains() {
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
          Domains
        </h1>
        <p className="max-w-2xl trykker-regular text-slate-500 dark:text-slate-400">
          Track domain renewals and manage your website domains.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <ShadowCard className="overflow-hidden py-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="min-w-[1120px] w-full text-left">
                <thead className="bg-slate-50/85 text-sm text-slate-500 dark:bg-slate-950/80 dark:text-slate-400">
                  <tr className="border-b border-slate-200/80 dark:border-slate-800/80">
                    <th className="px-5 py-4 font-medium">Domain</th>
                    <th className="px-5 py-4 font-medium">URL</th>
                    <th className="px-5 py-4 font-medium">Renewal Date</th>
                    <th className="px-5 py-4 font-medium">Days Remaining</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/80">
                  {domains.map((domain) => {
                    const daysRemaining = getDaysRemaining(domain.renewalDate);
                    const isExpired = daysRemaining !== null && daysRemaining <= 0;
                    const isWarning = domain.accent === "warning";
                    const rowClassName = isExpired
                      ? "bg-rose-50/90 dark:bg-rose-950/22"
                      : isWarning
                        ? "bg-orange-50/45 dark:bg-orange-950/10"
                        : "bg-white hover:bg-slate-50/70 dark:bg-slate-900 dark:hover:bg-slate-950/70";
                    const cellClassName = isExpired
                      ? "bg-rose-50/90 dark:bg-rose-950/22"
                      : "bg-transparent";

                    return (
                      <tr
                        key={domain.id}
                        className={`transition-colors ${rowClassName}`}
                      >
                        <td className={`px-5 py-4 ${cellClassName}`}>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                            {domain.domain}
                          </p>
                        </td>
                        <td className={`px-5 py-4 ${cellClassName}`}>
                          <a
                            href={domain.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
                          >
                            <span>{domain.url}</span>
                            <ExternalLink className="size-3.5" />
                          </a>
                        </td>
                        <td className={`px-5 py-4 ${cellClassName} text-sm text-slate-800 dark:text-slate-200`}>
                          {domain.renewalLabel ?? formatRenewalDate(domain.renewalDate)}
                        </td>
                        <td className={`px-5 py-4 ${cellClassName}`}>
                          <div className="space-y-2">
                            <div
                              className={[
                                "flex items-center gap-2 text-sm font-semibold",
                                isExpired ? "text-rose-700 dark:text-rose-300" : "text-slate-800 dark:text-slate-100",
                                isWarning ? "text-orange-600 dark:text-orange-400" : "",
                              ].join(" ")}
                            >
                              {isExpired || isWarning ? <AlertTriangle className="size-4" /> : null}
                              <span>
                                {daysRemaining === null
                                  ? "Expired"
                                  : isExpired
                                    ? "Expired"
                                    : `${daysRemaining} days`}
                              </span>
                            </div>
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                              <div
                                className={`h-full rounded-full ${getProgressColor(daysRemaining)}`}
                                style={{ width: getProgressWidth(daysRemaining) }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className={`px-5 py-4 ${cellClassName}`}>
                          <span
                            className={[
                              "inline-flex rounded-xl px-3 py-1 text-xs font-medium",
                              isExpired
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                                : domain.status === "Active"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                  : "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
                            ].join(" ")}
                          >
                            {domain.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </ShadowCard>
      </motion.div>
    </div>
  );
}
