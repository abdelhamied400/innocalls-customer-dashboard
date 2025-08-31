"use client";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import Field from "@/components/ui/field";
import { useFilterManager } from "@/hooks/useFilterManager";
import { activityReportsFiltersSchema } from "@/validation/activityReportsFilters";
import {
  BarChart,
  Insights,
  Search,
  Timeline,
  Schedule,
  AccessTime,
  HourglassEmpty,
} from "@mui/icons-material";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "@/providers/TranslationProvider";
import QuickStats from "./quick-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import DateCallDistribution from "./date-call-distribution";
import TalkTimeDistribution from "./talk-time-distribution";
import WaitTimeDistribution from "./wait-time-distribution";
import HourlyCallDistribution from "./hourly-call-distribution";
import useAppStore from "@/store/app.slice";

export type ActivityReportsFilters = {
  fromDate: Date;
  toDate: Date;
};

const today = new Date();
const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

const ActivityReports = () => {
  const t = useTranslations("analytics.activityAnalysis");
  const tCommon = useTranslations("analytics.common");
  const [currentTab, setCurrentTab] = useState("dateCallDistribution");
  const { setPageTitle } = useAppStore();

  const activityReportsFilterConfig = {
    defaultValues: {
      fromDate: lastMonth,
      toDate: today,
    } as ActivityReportsFilters,
    schema: activityReportsFiltersSchema(t, tCommon),
  };

  const { values, appliedValues, errors, setValue, reset, apply } =
    useFilterManager<ActivityReportsFilters>(activityReportsFilterConfig);

  useEffect(() => {
    setPageTitle(t("title"));
  }, []);

  return (
    <div className="page" id="activity-reports">
      <div className="flex flex-col gap-2">
        <div className="filters">
          <StatsDetailedCard
            title={t("title")}
            icon={<BarChart />}
            value=""
            color="primary"
          >
            <div className="py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Field
                label={tCommon("form.fields.fromDate.label")}
                postIcon={<CalendarIcon className="text-gray-400" />}
                error={errors.fromDate}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder={tCommon("form.fields.fromDate.placeholder")}
                  value={values.fromDate || new Date()}
                  onChange={(date) => setValue("fromDate", date || new Date())}
                />
              </Field>
              <Field
                label={tCommon("form.fields.toDate.label")}
                postIcon={<CalendarIcon className="text-gray-400" />}
                error={errors.toDate}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder={tCommon("form.fields.toDate.placeholder")}
                  value={values.toDate || new Date()}
                  onChange={(date) => setValue("toDate", date || new Date())}
                />
              </Field>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={reset}>
                {tCommon("actions.resetFilter")}
              </Button>
              <Button
                onClick={() => {
                  apply();
                }}
              >
                <Search />
                {tCommon("actions.applyFilters")}
              </Button>
            </div>
          </StatsDetailedCard>
        </div>

        <div className="content">
          <QuickStats filters={appliedValues} />

          <StatsDetailedCard
            title={t("detailedStats.title")}
            subtitle={t("detailedStats.subtitle")}
            icon={<Insights />}
            value=""
            color="primary"
          >
            <Tabs
              className="w-full"
              value={currentTab}
              onValueChange={setCurrentTab}
            >
              <TabsList>
                <TabsTrigger
                  value="dateCallDistribution"
                  className="flex items-center gap-1"
                >
                  <Timeline />
                  {t("detailedStats.tabs.dateCallDistribution")}
                </TabsTrigger>
                <TabsTrigger
                  value="hourlyCallDistribution"
                  className="flex items-center gap-1"
                >
                  <Schedule />
                  {t("detailedStats.tabs.hourlyCallDistribution")}
                </TabsTrigger>
                <TabsTrigger
                  value="talkTimeDistribution"
                  className="flex items-center gap-1"
                >
                  <AccessTime />
                  {t("detailedStats.tabs.talkTimeDistribution")}
                </TabsTrigger>
                <TabsTrigger
                  value="waitTimeDistribution"
                  className="flex items-center gap-1"
                >
                  <HourglassEmpty />
                  {t("detailedStats.tabs.waitTimeDistribution")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="dateCallDistribution">
                <DateCallDistribution filters={appliedValues} />
              </TabsContent>
              <TabsContent value="hourlyCallDistribution">
                <HourlyCallDistribution filters={appliedValues} />
              </TabsContent>
              <TabsContent value="talkTimeDistribution">
                <TalkTimeDistribution filters={appliedValues} />
              </TabsContent>
              <TabsContent value="waitTimeDistribution">
                <WaitTimeDistribution filters={appliedValues} />
              </TabsContent>
            </Tabs>
          </StatsDetailedCard>
        </div>
      </div>
    </div>
  );
};

export default ActivityReports;
