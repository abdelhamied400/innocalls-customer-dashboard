"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import postCallSurveyService from "@/services/post-call-survey.service";
import { useTranslations } from "@/providers/TranslationProvider";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "recharts";
import Property from "@/components/Property";
import {
  CHART_COLORS,
  NPS_COLORS,
  QUESTION_TYPES,
} from "@/constants/call-survey";
import type { PostCallSurveyAnalysis } from "@/types/api/post-call-survey";
import withActiveOrganization from "@/containers/withActiveOrganization";

const PostCallSurveyAnalytics = () => {
  const t = useTranslations("postCallSurvey.analytics");
  const { id } = useParams<{ id: string }>();

  const { data: metrics, isLoading } =
    useLocalizedQuery<PostCallSurveyAnalysis>({
      queryKey: ["post-call-survey-analysis", id],
      queryFn: () => postCallSurveyService.getAnalysis(id as string),
      enabled: !!id,
      gcTime: 0,
    });

  const questionsData = useMemo(() => {
    if (!metrics) return [];
    return metrics.userResponses.map((q, idx) => {
      const pieData = q.responses.map((r, i) => ({
        name: String(r.userResponse),
        value: r.count,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }));
      const nps = { ...metrics.questionsNPS[idx], ...q };
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

  if (!metrics || metrics.userResponses.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center text-muted-foreground">
        {t("noData")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {questionsData.map((q) => (
        <div
          key={q.questionIndex}
          className="flex flex-col gap-5 bg-white rounded-lg p-4"
        >
          <h3 className="text-lg font-semibold m-0">
            {t("questionLabel", { number: q.questionIndex + 1 })}
          </h3>

          {q.nps && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Property
                label={t("fields.questionType")}
                value={QUESTION_TYPES[q.nps.questionType] || q.nps.questionType}
              />
              <Property
                label={t("fields.totalResponses")}
                value={q.nps.totalResponses}
              />
              <Property
                label={t("fields.totalAnswers")}
                value={q.nps.totalAnswers}
              />
              <Property
                label={t("fields.promotersCount")}
                value={`${q.nps.promoters} (${q.nps.promoterPercentage.toFixed(1)}%)`}
              />
              <Property
                label={t("fields.passivesCount")}
                value={`${q.nps.passives} (${(100 - q.nps.promoterPercentage - q.nps.detractorPercentage).toFixed(1)}%)`}
              />
              <Property
                label={t("fields.detractorsCount")}
                value={`${q.nps.detractors} (${q.nps.detractorPercentage.toFixed(1)}%)`}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={q.barData} barCategoryGap="20%" barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
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

            <div>
              <div className="h-52">
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
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
              <div className="flex flex-wrap items-center justify-center gap-4">
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
          </div>

          <hr className="border-dashed" />
        </div>
      ))}
    </div>
  );
};

export default withActiveOrganization(PostCallSurveyAnalytics);
