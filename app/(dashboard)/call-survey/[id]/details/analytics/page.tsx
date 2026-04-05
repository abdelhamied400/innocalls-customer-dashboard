"use client";
import { Button } from "@/components/ui/button";
import {
  Download,
  ThumbUp,
  ThumbDown,
  ThumbsUpDown,
} from "@mui/icons-material";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import callSurveyService from "@/services/call-survey.service";
import { useTranslations } from "@/providers/TranslationProvider";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const CHART_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
  "#84cc16",
];

const NPS_COLORS = {
  promoters: "#10b981",
  detractors: "#ef4444",
  passives: "#f59e0b",
};

const questionTypes: Record<string, string> = {
  one_five: "1 - 5",
  one_ten: "1 - 10",
  zero_nine: "1 - 10",
  yes_no: "Yes / No",
};

type UserResponse = {
  questionIndex: number;
  responses: { userResponse: string | number; count: number }[];
};

type QuestionNPS = {
  questionType: string;
  totalResponses: number;
  npsScore: number;
  promoterPercentage: number;
  detractorPercentage: number;
  promoters: number;
  detractors: number;
  passives: number;
};

type AnalysisData = {
  userResponses: UserResponse[];
  questionsNPS: QuestionNPS[];
};

const NpsScoreBadge = ({ score }: { score: number }) => {
  const variant = score > 0 ? "success" : score < 0 ? "destructive" : "warning";
  return (
    <Badge variant={variant} className="text-base px-3 py-1">
      {score > 0 ? "+" : ""}
      {score.toFixed(2)}
    </Badge>
  );
};

const SurveyAnalytics = () => {
  const t = useTranslations("callSurvey.analytics");
  const { id } = useParams<{ id: string }>();
  const [isExporting, setIsExporting] = useState(false);

  const { data: metrics, isLoading } = useLocalizedQuery<AnalysisData>({
    queryKey: ["call-survey-analysis", id],
    queryFn: () => callSurveyService.getAnalysis(id as string),
    enabled: !!id,
    gcTime: 0,
  });

  const handleExport = async () => {
    if (!id) return;
    try {
      setIsExporting(true);
      await callSurveyService.exportStats(id);
      toast.success(t("exportSuccess"), {
        description: t("exportSuccessDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("exportError"), {
          description:
            error.response?.data?.message || t("exportErrorDescription"),
        });
        return;
      }
      toast.error(t("exportError"), {
        description: t("exportErrorDescription"),
      });
    } finally {
      setIsExporting(false);
    }
  };

  const questionsData = useMemo(() => {
    if (!metrics) return [];
    return metrics.userResponses.map((q, idx) => {
      const pieData = q.responses.map((r, i) => ({
        name: String(r.userResponse),
        value: r.count,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }));
      const nps = metrics.questionsNPS[idx];
      const barData = nps
        ? [
            {
              name: "",
              [t("nps.promoters")]: nps.promoters,
              [t("nps.detractors")]: nps.detractors,
              [t("nps.passives")]: nps.passives,
            },
          ]
        : [];
      return { questionIndex: q.questionIndex, pieData, nps, barData };
    });
  }, [metrics, t]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="h-8 w-48 rounded" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-72 rounded-lg" />
              <Skeleton className="h-72 rounded-lg" />
            </div>
          </div>
        ))}
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
    <div className="flex flex-col gap-8">
      {/* Export button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isExporting}
        >
          <Download sx={{ fontSize: 16 }} className="me-1" />
          {isExporting ? t("exporting") : t("export")}
        </Button>
      </div>

      {questionsData.map((q) => (
        <div key={q.questionIndex} className="flex flex-col gap-5">
          {/* Question header */}
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold m-0">
              {t("questionLabel", {
                number: q.questionIndex + 1,
              })}
            </h3>
            {q.nps && (
              <Badge variant="secondary">
                {questionTypes[q.nps.questionType] || q.nps.questionType}
              </Badge>
            )}
          </div>

          {/* NPS stat cards */}
          {q.nps && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* NPS Score */}
              <div className="border rounded-lg p-4 flex flex-col gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  {t("fields.npsScore")}
                </span>
                <NpsScoreBadge score={q.nps.npsScore} />
                <span className="text-xs text-muted-foreground">
                  {q.nps.totalResponses}{" "}
                  {t("fields.totalResponses").toLowerCase()}
                </span>
              </div>

              {/* Promoters */}
              <div
                className="rounded-lg p-4 flex items-center gap-3 border"
                style={{
                  backgroundColor: `${NPS_COLORS.promoters}10`,
                  borderColor: `${NPS_COLORS.promoters}30`,
                }}
              >
                <div
                  className="rounded-full p-2"
                  style={{
                    backgroundColor: `${NPS_COLORS.promoters}20`,
                  }}
                >
                  <ThumbUp
                    sx={{ fontSize: 20 }}
                    style={{ color: NPS_COLORS.promoters }}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground m-0">
                    {t("nps.promoters")}
                  </p>
                  <p
                    className="text-xl font-bold m-0"
                    style={{ color: NPS_COLORS.promoters }}
                  >
                    {q.nps.promoters}
                  </p>
                  <p className="text-xs text-muted-foreground m-0">
                    {q.nps.promoterPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Passives */}
              <div
                className="rounded-lg p-4 flex items-center gap-3 border"
                style={{
                  backgroundColor: `${NPS_COLORS.passives}10`,
                  borderColor: `${NPS_COLORS.passives}30`,
                }}
              >
                <div
                  className="rounded-full p-2"
                  style={{
                    backgroundColor: `${NPS_COLORS.passives}20`,
                  }}
                >
                  <ThumbsUpDown
                    sx={{ fontSize: 20 }}
                    style={{ color: NPS_COLORS.passives }}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground m-0">
                    {t("nps.passives")}
                  </p>
                  <p
                    className="text-xl font-bold m-0"
                    style={{ color: NPS_COLORS.passives }}
                  >
                    {q.nps.passives}
                  </p>
                  <p className="text-xs text-muted-foreground m-0">
                    {(
                      100 -
                      q.nps.promoterPercentage -
                      q.nps.detractorPercentage
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>

              {/* Detractors */}
              <div
                className="rounded-lg p-4 flex items-center gap-3 border"
                style={{
                  backgroundColor: `${NPS_COLORS.detractors}10`,
                  borderColor: `${NPS_COLORS.detractors}30`,
                }}
              >
                <div
                  className="rounded-full p-2"
                  style={{
                    backgroundColor: `${NPS_COLORS.detractors}20`,
                  }}
                >
                  <ThumbDown
                    sx={{ fontSize: 20 }}
                    style={{ color: NPS_COLORS.detractors }}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground m-0">
                    {t("nps.detractors")}
                  </p>
                  <p
                    className="text-xl font-bold m-0"
                    style={{ color: NPS_COLORS.detractors }}
                  >
                    {q.nps.detractors}
                  </p>
                  <p className="text-xs text-muted-foreground m-0">
                    {q.nps.detractorPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pie — response distribution */}
            <div className="border rounded-lg p-4 bg-white">
              <h4 className="mb-4 text-sm font-semibold text-muted-foreground">
                {t("sections.responseDistribution")}
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={q.pieData}
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                      cornerRadius={4}
                    >
                      {q.pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (
                            viewBox &&
                            "cx" in viewBox &&
                            "cy" in viewBox
                          ) {
                            const total = q.pieData.reduce(
                              (sum, d) => sum + d.value,
                              0,
                            );
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  dy="-0.6em"
                                  className="fill-muted-foreground text-xs"
                                >
                                  {t("fields.totalResponses")}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  dy="1.6em"
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
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-3">
                {q.pieData.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {entry.name}
                    </span>
                    <span className="text-sm font-bold">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar — NPS breakdown */}
            {q.nps && (
              <div className="border rounded-lg p-4 bg-white">
                <h4 className="mb-4 text-sm font-semibold text-muted-foreground">
                  {t("sections.npsBreakdown")}
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={q.barData}
                      barCategoryGap="20%"
                      barGap={8}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                      />
                      <XAxis dataKey="name" tick={false} />
                      <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 12 }}
                      />
                      <Bar
                        dataKey={t("nps.promoters")}
                        fill={NPS_COLORS.promoters}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey={t("nps.detractors")}
                        fill={NPS_COLORS.detractors}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey={t("nps.passives")}
                        fill={NPS_COLORS.passives}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Divider between questions */}
          <hr className="border-dashed" />
        </div>
      ))}
    </div>
  );
};

export default SurveyAnalytics;
