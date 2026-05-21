import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ChevronDown, ExternalLink, FolderPlus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { createDomain, fetchDomains, type Domain as ApiDomain } from "../lib/api";
import { cn } from "../lib/utils";

type DeliveryStatus = "Active" | "Terminated" | "Delivered";

type DomainRow = ApiDomain & {
  renewalDate: string | null;
  renewalLabel?: string;
  accent?: "warning";
};

const emptyDomainRows: DomainRow[] = [];

const today = new Date("2026-05-15T00:00:00");

type DomainFormData = {
  domain: string;
  url: string;
  renewalDate: string;
  status: DeliveryStatus;
};

const defaultFormData: DomainFormData = {
  domain: "",
  url: "",
  renewalDate: "",
  status: "Active",
};

const statuses: Array<DeliveryStatus | "All"> = [
  "All",
  "Active",
  "Terminated",
  "Delivered",
];

const inputClassName =
  "h-11 rounded-xl border-slate-200/80 bg-white text-slate-800 shadow-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 focus-visible:ring-1 focus-visible:ring-blue-500/30 focus-visible:border-blue-400/50";

const interactiveInputClassName =
  `${inputClassName} cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer`;

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

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80",
        className,
      )}
    />
  );
}

function DomainsSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-44 rounded-lg" />
        <SkeletonBlock className="h-4 w-72 rounded-md" />
      </div>

      {/* ShadowCard — search + filter + table all inside, matching real layout */}
      <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)] dark:bg-slate-900 dark:shadow-[0_18px_46px_rgba(2,6,23,0.32)]">
        <div className="p-6 space-y-5">
          {/* Search + filter + button */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SkeletonBlock className="h-10 w-full max-w-xl rounded-lg" />
            <SkeletonBlock className="h-10 w-48 rounded-xl" />
            <SkeletonBlock className="h-10 w-36 rounded-lg" />
          </div>

          {/* Inner table container */}
          <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:bg-slate-900">
            <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="min-w-[1120px] w-full text-left">
                <thead className="bg-slate-50/85 dark:bg-slate-950/80">
                  <tr className="border-b border-slate-200/80 dark:border-slate-800/80">
                    <th className="px-5 py-4"><SkeletonBlock className="h-3 w-16 rounded-md" /></th>
                    <th className="px-5 py-4"><SkeletonBlock className="h-3 w-8 rounded-md" /></th>
                    <th className="px-5 py-4"><SkeletonBlock className="h-3 w-24 rounded-md" /></th>
                    <th className="px-5 py-4"><SkeletonBlock className="h-3 w-28 rounded-md" /></th>
                    <th className="px-5 py-4"><SkeletonBlock className="h-3 w-12 rounded-md" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/80">
                  {Array.from({ length: 6 }).map((_, row) => (
                    <tr key={row} className="bg-white dark:bg-slate-900">
                      <td className="px-5 py-4"><SkeletonBlock className="h-4 w-36 rounded-md" /></td>
                      <td className="px-5 py-4"><SkeletonBlock className="h-4 w-52 rounded-md" /></td>
                      <td className="px-5 py-4"><SkeletonBlock className="h-4 w-44 rounded-md" /></td>
                      <td className="px-5 py-4">
                        <div className="space-y-2">
                          <SkeletonBlock className="h-4 w-16 rounded-md" />
                          <SkeletonBlock className="h-2 w-20 rounded-full" />
                        </div>
                      </td>
                      <td className="px-5 py-4"><SkeletonBlock className="h-6 w-20 rounded-full" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}function formatRenewalDate(value: string | null) {
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
  const selectedLabel = value === "All" ? label : value;

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

function DomainModal({
  isOpen,
  formData,
  onClose,
  onSubmit,
  onChange,
}: {
  isOpen: boolean;
  formData: DomainFormData;
  onClose: () => void;
  onSubmit: () => void;
  onChange: <K extends keyof DomainFormData>(field: K, value: DomainFormData[K]) => void;
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full max-w-2xl rounded-[24px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] dark:bg-slate-900 dark:shadow-[0_34px_90px_rgba(2,6,23,0.72)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200/80 px-6 py-5 dark:border-slate-800">
              <div className="space-y-1">
                <h2 className="text-xl calistoga-regular text-slate-900 dark:text-slate-100">
                  Add New Domain
                </h2>
                <p className="text-sm trykker-regular text-slate-500 dark:text-slate-400">
                  Add a domain with its URL, renewal date, and delivery status.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              className="space-y-5 px-6 py-6"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
              }}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="domain-name" className="text-slate-700 dark:text-slate-200">
                    Domain Name
                  </Label>
                  <Input
                    id="domain-name"
                    value={formData.domain}
                    onChange={(event) => onChange("domain", event.target.value)}
                    placeholder="example.com"
                    className={inputClassName}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain-url" className="text-slate-700 dark:text-slate-200">
                    Website URL
                  </Label>
                  <Input
                    id="domain-url"
                    type="url"
                    value={formData.url}
                    onChange={(event) => onChange("url", event.target.value)}
                    placeholder="https://example.com"
                    className={inputClassName}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="renewal-date" className="text-slate-700 dark:text-slate-200">
                    Renewal Date
                  </Label>
                  <Input
                    id="renewal-date"
                    type="date"
                    value={formData.renewalDate}
                    onChange={(event) => onChange("renewalDate", event.target.value)}
                    className={interactiveInputClassName}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain-status" className="text-slate-700 dark:text-slate-200">
                    Status
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        id="domain-status"
                        type="button"
                        className={`${interactiveInputClassName} flex w-full items-center justify-between rounded-xl border border-slate-200/80 px-3 text-left shadow-none dark:border-slate-700`}
                      >
                        <span className="truncate">{formData.status}</span>
                        <ChevronDown className="size-4 shrink-0 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="rounded-xl border-0 ring-0 bg-white p-1.5 shadow-[0_18px_42px_rgba(15,23,42,0.14)] dark:bg-slate-900 dark:shadow-[0_20px_48px_rgba(2,6,23,0.48)]"
                    >
                      <DropdownMenuRadioGroup
                        value={formData.status}
                        onValueChange={(value) => onChange("status", value as DeliveryStatus)}
                      >
                        {statuses
                          .filter((status) => status !== "All" && status !== "Terminated")
                          .map((status) => (
                            <DropdownMenuRadioItem
                              key={status}
                              value={status}
                              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 focus:bg-slate-100 dark:text-slate-100 dark:focus:bg-slate-800"
                            >
                              {status}
                            </DropdownMenuRadioItem>
                          ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700"
                >
                  Save Domain
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function Domains() {
  const queryClient = useQueryClient();
  const domainsQuery = useQuery({
    queryKey: ["domains"],
    queryFn: fetchDomains,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | "All">("All");
  const createDomainMutation = useMutation({
    mutationFn: createDomain,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["domains"] });
      closeModal();
    },
  });

  const isLoading = domainsQuery.isLoading;
  const isError = domainsQuery.isError;

  const domainRows: DomainRow[] = domainsQuery.data ?? emptyDomainRows;

  const filteredDomains = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return domainRows.filter((domain) => {
      const matchesSearch =
        query.length === 0 ||
        domain.domain.toLowerCase().includes(query) ||
        domain.url.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || domain.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [domainRows, searchTerm, statusFilter]);

  const openCreateModal = () => {
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(defaultFormData);
  };

  const handleFormChange = <K extends keyof DomainFormData>(
    field: K,
    value: DomainFormData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCreateDomain = () => {
    const normalizedDomain = formData.domain.trim();
    const normalizedUrl = formData.url.trim();

    if (!normalizedDomain || !normalizedUrl || !formData.renewalDate) {
      return;
    }

    createDomainMutation.mutate({
      domain: normalizedDomain,
      url: normalizedUrl,
      renewalDate: formData.renewalDate,
      status: formData.status,
    });
  };

  if (isLoading) {
    return <DomainsSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="rounded-xl bg-rose-50 p-6 text-center text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">
          Could not load domains from the API. Start the Express server and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="space-y-2">
          <h1 className="text-2xl calistoga-regular text-slate-800 dark:text-slate-100">
            Domains
          </h1>
          <p className="max-w-2xl trykker-regular text-slate-500 dark:text-slate-400">
            Track domain renewals and manage your website domains.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <ShadowCard className="overflow-hidden">
          <CardContent className="space-y-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative max-w-xl min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search domains or URLs..."
                  className="h-10 w-full rounded-lg border-slate-200/80 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:border-blue-400/50 focus-visible:ring-1 focus-visible:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <FilterDropdown
                  className="min-w-[190px]"
                  value={statusFilter}
                  label="All Status"
                  options={statuses}
                  onValueChange={(value) => setStatusFilter(value as DeliveryStatus | "All")}
                />
              </div>

              <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="cursor-pointer rounded-lg border-slate-200/80 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  onClick={openCreateModal}
                >
                  <FolderPlus className="size-4" />
                  Add Domain
                </Button>
              </motion.div>
            </div>

            <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:bg-slate-900">
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
                    {filteredDomains.length > 0 ? filteredDomains.map((domain) => {
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
                                  : domain.status === "Terminated"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                    : "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
                              ].join(" ")}
                            >
                              {domain.status}
                            </span>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr className="bg-white dark:bg-slate-900">
                        <td
                          colSpan={5}
                          className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                        >
                          No domains match the current search or status filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </ShadowCard>
      </motion.div>

      <DomainModal
        isOpen={isModalOpen}
        formData={formData}
        onClose={closeModal}
        onSubmit={handleCreateDomain}
        onChange={handleFormChange}
      />
    </div>
  );
}
