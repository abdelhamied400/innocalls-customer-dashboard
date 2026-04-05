"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Close,
  Phone,
  PhoneCallback,
  PhoneInTalk,
} from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import callSurveyService from "@/services/call-survey.service";
import { useTranslations } from "@/providers/TranslationProvider";
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
import { Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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
  initiated: "#f59e0b",
  inProgress: "#10b981",
};

const SurveyMetricsSheet = () => {
  const t = useTranslations("callSurvey.metrics");
  const router = useRouter();
  const searchParams = useSearchParams();
  const surveyId = searchParams.get("id");
  const [isOpen, setIsOpen] = useState(true);

  const { data: metrics, isLoading } = useLocalizedQuery<MetricsData>({
    queryKey: ["call-survey-metrics", surveyId],
    queryFn: () => callSurveyService.getMetrics(surveyId as string),
    enabled: !!surveyId,
    gcTime: 0,
    refetchInterval: 10000,
  });

  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  const total =
    metrics
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

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <SheetContent side="bottom" className="h-screen p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">{t("title")}</h2>
            <Button size="icon" variant="unstyled" onClick={handleClose}>
              <Close className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 mx-auto my-8 w-full max-w-[900px] max-h-[calc(100vh-200px)] overflow-auto px-4">
            {isLoading && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-lg" />
                  ))}
                </div>
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            )}

            {!isLoading && !metrics && (
              <div className="text-center text-muted-foreground py-8">
                {t("noData")}
              </div>
            )}

            {!isLoading && metrics && (
              <div className="flex flex-col gap-6">
                {/* Stat cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Total */}
                  <div
                    className="rounded-lg p-4 flex items-center gap-4 border"
                    style={{
                      backgroundColor: `${COLORS.total}10`,
                      borderColor: `${COLORS.total}30`,
                    }}
                  >
                    <div
                      className="rounded-full p-2.5"
                      style={{ backgroundColor: `${COLORS.total}20` }}
                    >
                      <Phone style={{ color: COLORS.total }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("fields.total")}
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: COLORS.total }}
                      >
                        {total}
                      </p>
                    </div>
                  </div>

                  {/* Initiated */}
                  <div
                    className="rounded-lg p-4 flex items-center gap-4 border"
                    style={{
                      backgroundColor: `${COLORS.initiated}10`,
                      borderColor: `${COLORS.initiated}30`,
                    }}
                  >
                    <div
                      className="rounded-full p-2.5"
                      style={{ backgroundColor: `${COLORS.initiated}20` }}
                    >
                      <PhoneCallback style={{ color: COLORS.initiated }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("fields.initiated")}
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: COLORS.initiated }}
                      >
                        {metrics.callsStats.initiated}
                      </p>
                    </div>
                  </div>

                  {/* In Progress */}
                  <div
                    className="rounded-lg p-4 flex items-center gap-4 border"
                    style={{
                      backgroundColor: `${COLORS.inProgress}10`,
                      borderColor: `${COLORS.inProgress}30`,
                    }}
                  >
                    <div
                      className="rounded-full p-2.5"
                      style={{ backgroundColor: `${COLORS.inProgress}20` }}
                    >
                      <PhoneInTalk style={{ color: COLORS.inProgress }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("fields.inProgress")}
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: COLORS.inProgress }}
                      >
                        {metrics.callsStats.inProgress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pie chart */}
                <div className="border rounded-lg p-4">
                  <h3 className="mb-4">{t("sections.stats")}</h3>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-52 h-52 lg:w-64 lg:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            dataKey="value"
                            data={pieData}
                            innerRadius={60}
                            outerRadius={90}
                          >
                            {pieData.map((entry) => (
                              <Cell
                                key={entry.name}
                                fill={entry.color}
                              />
                            ))}
                            <Label
                              content={({ viewBox }) => {
                                if (
                                  viewBox &&
                                  "cx" in viewBox &&
                                  "cy" in viewBox
                                ) {
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
                          <Tooltip
                            formatter={(value: number) => value}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-col gap-3">
                      {pieData.map((entry) => (
                        <div
                          key={entry.name}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-muted-foreground">
                            {entry.name}
                          </span>
                          <span className="font-bold">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Initiated calls table */}
                <div className="flex flex-col gap-2 border rounded-lg">
                  <div className="header p-4 bg-neutral-100 rounded-t-lg flex items-center gap-2">
                    <h3>{t("sections.initiatedCalls")}</h3>
                    <Badge variant="warning">
                      {metrics.initiatedCalls.length}
                    </Badge>
                  </div>
                  {metrics.initiatedCalls.length > 0 ? (
                    <Table>
                      <TableHeader className="bg-neutral-100">
                        <TableRow>
                          <TableHead>{t("fields.name")}</TableHead>
                          <TableHead>{t("fields.phone")}</TableHead>
                          <TableHead>{t("fields.currentTrial")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {metrics.initiatedCalls.map((call) => (
                          <TableRow
                            key={call.id}
                            className="border-0 hover:bg-transparent"
                          >
                            <TableCell>{call.name}</TableCell>
                            <TableCell>{call.phone}</TableCell>
                            <TableCell>{call.currentTrial}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      {t("noCalls")}
                    </div>
                  )}
                </div>

                {/* In-progress calls table */}
                <div className="flex flex-col gap-2 border rounded-lg">
                  <div className="header p-4 bg-neutral-100 rounded-t-lg flex items-center gap-2">
                    <h3>{t("sections.inProgressCalls")}</h3>
                    <Badge variant="success">
                      {metrics.inProgressCalls.length}
                    </Badge>
                  </div>
                  {metrics.inProgressCalls.length > 0 ? (
                    <Table>
                      <TableHeader className="bg-neutral-100">
                        <TableRow>
                          <TableHead>{t("fields.name")}</TableHead>
                          <TableHead>{t("fields.phone")}</TableHead>
                          <TableHead>{t("fields.currentTrial")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {metrics.inProgressCalls.map((call) => (
                          <TableRow
                            key={call.id}
                            className="border-0 hover:bg-transparent"
                          >
                            <TableCell>{call.name}</TableCell>
                            <TableCell>{call.phone}</TableCell>
                            <TableCell>{call.currentTrial}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      {t("noCalls")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SurveyMetricsSheet;
