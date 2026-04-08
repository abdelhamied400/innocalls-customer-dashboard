"use client";
import { Search } from "@mui/icons-material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import callSurveyService from "@/services/call-survey.service";
import { useTranslations } from "@/providers/TranslationProvider";
import { TERMINAL_STATUSES } from "@/constants/call-survey";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import StatsMiniCard from "@/components/StatsMiniCard";

type MetricsCall = {
  id: string;
  phone: string;
  name: string;
  currentTrial: number;
};

type MetricsData = {
  initiatedCalls: MetricsCall[];
  inProgressCalls: MetricsCall[];
  callsStats: {
    inProgress: number;
    initiated: number;
  };
};

const COLORS = {
  total: "#6366f1",
  initiated: "#FFD061",
  inProgress: "#0E4D80",
};

const CallsTable = ({
  calls,
  search,
  t,
  emptyMessage,
}: {
  calls: MetricsCall[];
  search: string;
  t: any;
  emptyMessage: string;
}) => {
  const filtered = useMemo(() => {
    if (!search) return calls;
    const q = search.toLowerCase();
    return calls.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q),
    );
  }, [calls, search]);

  if (filtered.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-neutral-100">
        <TableRow>
          <TableHead>{t("fields.name")}</TableHead>
          <TableHead>{t("fields.phone")}</TableHead>
          <TableHead>{t("fields.currentTrial")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map((call) => (
          <TableRow key={call.id} className="border-0 hover:bg-transparent">
            <TableCell>{call.name}</TableCell>
            <TableCell>{call.phone}</TableCell>
            <TableCell>{call.currentTrial}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const SurveyLiveMetrics = () => {
  const t = useTranslations("callSurvey.metrics");
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: survey } = useLocalizedQuery({
    queryKey: ["call-survey-detail", id],
    queryFn: () => callSurveyService.getSurvey(id as string),
    enabled: !!id,
    gcTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && TERMINAL_STATUSES.includes(status)) return false;
      return 10000;
    },
  });

  const isActive = survey?.status === "active";

  const { data: metrics, isLoading } = useLocalizedQuery<MetricsData>({
    queryKey: ["call-survey-metrics", id],
    queryFn: () => callSurveyService.getMetrics(id as string),
    enabled: !!id && isActive,
    gcTime: 0,
    refetchInterval: isActive ? 10000 : false,
  });

  useEffect(() => {
    if (TERMINAL_STATUSES.includes(survey?.status || "")) {
      router.replace(`/call-survey/${id}/details/analytics`);
    }
  }, [id, router, survey?.status]);

  const total = metrics
    ? metrics.callsStats.initiated + metrics.callsStats.inProgress
    : 0;

  const pieData = metrics
    ? [
        {
          name: t("fields.initiated"),
          value: metrics.callsStats.initiated,
          color: COLORS.initiated,
        },
        {
          name: t("fields.inProgress"),
          value: metrics.callsStats.inProgress,
          color: COLORS.inProgress,
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {t("noData")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-white rounded-lg p-4">
      {/* Pie chart + Stat cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-2">
        <div className="border rounded-lg p-4">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-48 h-48 lg:w-48 lg:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={pieData}
                    innerRadius={60}
                    outerRadius={90}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                dy="-0.5em"
                                className="fill-muted-foreground text-sm"
                              >
                                {t("fields.total")}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                dy="1.5em"
                                className="fill-foreground text-2xl font-bold"
                              >
                                {total}
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                  <Tooltip formatter={(value: number) => value} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-row lg:flex-col gap-3">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-sm shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground flex-1 min-w-20">
                    {entry.name}
                  </span>
                  <span className="font-bold ">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <StatsMiniCard
              icon={
                <Image
                  src="/assets/icons/stats/phone.svg"
                  alt="Total Calls"
                  width={24}
                  height={24}
                />
              }
              label={t("fields.total")}
              value={total}
              color="info"
            />
          </div>
          <StatsMiniCard
            icon={
              <Image
                src="/assets/icons/stats/phone_callback.svg"
                alt="Initiated Calls"
                width={24}
                height={24}
              />
            }
            label={t("fields.initiated")}
            value={metrics.callsStats.initiated}
            className="shadow-none"
            color="warning"
          />
          <StatsMiniCard
            icon={
              <Image
                src="/assets/icons/stats/call.svg"
                alt="In Progress Calls"
                width={24}
                height={24}
              />
            }
            label={t("fields.inProgress")}
            value={metrics.callsStats.inProgress}
            className="shadow-none"
            color="primary"
          />
        </div>
      </div>

      {/* Calls tables with tabs */}
      <div className="border rounded-lg">
        <Tabs defaultValue="initiated">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b">
            <TabsList>
              <TabsTrigger value="initiated" className="gap-1.5">
                {t("sections.initiatedCalls")}
                <Badge
                  variant="warning"
                  className="px-1.5 py-0 text-xs min-w-5 justify-center"
                >
                  {metrics.initiatedCalls.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="inProgress" className="gap-1.5">
                {t("sections.inProgressCalls")}
                <Badge
                  className="px-1.5 py-0 text-xs min-w-5 justify-center text-white"
                  style={{ backgroundColor: COLORS.inProgress }}
                >
                  {metrics.inProgressCalls.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            <Field preIcon={<Search className="text-muted-foreground" />}>
              <Input
                placeholder={t("search")}
                type="search"
                variant="field"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field>
          </div>

          <TabsContent value="initiated" className="mt-0">
            <CallsTable
              calls={metrics.initiatedCalls}
              search={search}
              t={t}
              emptyMessage={t("noCalls")}
            />
          </TabsContent>

          <TabsContent value="inProgress" className="mt-0">
            <CallsTable
              calls={metrics.inProgressCalls}
              search={search}
              t={t}
              emptyMessage={t("noCalls")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SurveyLiveMetrics;
