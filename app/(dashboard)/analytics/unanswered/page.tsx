"use client";

import React, { useEffect } from "react";
import { BarChart, CalendarMonth, Insights } from "@mui/icons-material";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import Field from "@/components/ui/field";
import DatePicker from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import Select from "@/components/select";
import useVocabStore from "@/store/vocab.slice";
import { useFilterManager } from "@/hooks/useFilterManager";
import { unansweredFiltersSchema } from "@/validation/unansweredFilters";
import InboundDistribution from "./inbound-distribution";
import InboundUnansweredHourly from "./inbound-hourly";
import OutboundDistribution from "./outbound-distribution";
import OutboundUnansweredHourly from "./outbound-hourly";
import QuickStats from "./quick-stats";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";

type Option = {
  value: string;
  label: string;
};

export type UnansweredAnalyticsFilters = {
  fromDate: Date;
  toDate: Date;
  agents: Option[];
};

const today = new Date();
const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

const UnansweredAnalytics = () => {
  const { extensions } = useVocabStore();
  const { setPageTitle } = useAppStore();
  const locale = useLocale();

  const t = useTranslations("analytics.unanswered");
  const tCommon = useTranslations("analytics.common");

  useEffect(() => {
    setPageTitle(t("title"));

    // Cleanup when component unmounts
    return () => setPageTitle(null);
  }, [locale]);

  const unansweredFilterConfig = {
    defaultValues: {
      fromDate: lastMonth,
      toDate: today,
      agents: [],
    } as UnansweredAnalyticsFilters,
    schema: unansweredFiltersSchema(tCommon),
  };

  const { values, appliedValues, errors, setValue, reset, apply } =
    useFilterManager<UnansweredAnalyticsFilters>(unansweredFilterConfig);

  return (
    <div className="page" id="unanswered-analytics">
      <div className="flex flex-col gap-2">
        <div className="filters">
          <StatsDetailedCard
            title={t("title")}
            icon={<BarChart />}
            value=""
            color="primary"
          >
            <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field
                label={tCommon("form.fields.fromDate.label")}
                postIcon={<CalendarMonth className="text-gray-400" />}
                error={errors.fromDate}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder={tCommon("form.fields.fromDate.placeholder")}
                  value={values.fromDate}
                  onChange={(date) => setValue("fromDate", date || new Date())}
                />
              </Field>
              <Field
                label={tCommon("form.fields.toDate.label")}
                postIcon={<CalendarMonth className="text-gray-400" />}
                error={errors.toDate}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder={tCommon("form.fields.toDate.placeholder")}
                  value={values.toDate}
                  onChange={(date) => setValue("toDate", date || new Date())}
                />
              </Field>
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <Select
                  className="w-full"
                  placeholder={tCommon("form.fields.agents.placeholder")}
                  value={values.agents}
                  onChange={(value) => setValue("agents", value || [])}
                  options={extensions?.map((ext) => ({
                    value: ext.ext,
                    label: `${ext.name} (${ext.ext})`,
                  }))}
                  isMulti
                  label={tCommon("form.fields.agents.label")}
                  showSelectedTags={false}
                  error={errors.agents}
                  isClearable
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={reset}>
                {tCommon("actions.resetFilter")}
              </Button>
              <Button onClick={apply}>{tCommon("actions.applyFilters")}</Button>
            </div>
          </StatsDetailedCard>
        </div>

        <QuickStats filters={appliedValues} />

        <div className="analytics-tabs">
          <StatsDetailedCard
            title={t("title")}
            subtitle={t("subtitle")}
            icon={<Insights />}
            value=""
            color="primary"
          >
            <Tabs defaultValue="inbound" className="w-full">
              <TabsList>
                <TabsTrigger value="inbound">{t("tabs.inbound")}</TabsTrigger>
                <TabsTrigger value="outbound">{t("tabs.outbound")}</TabsTrigger>
              </TabsList>

              <TabsContent value="inbound" className="flex flex-col gap-4">
                <InboundDistribution filters={appliedValues} />
                <InboundUnansweredHourly filters={appliedValues} />
              </TabsContent>

              <TabsContent value="outbound" className="flex flex-col gap-4">
                <OutboundDistribution filters={appliedValues} />
                <OutboundUnansweredHourly filters={appliedValues} />
              </TabsContent>
            </Tabs>
          </StatsDetailedCard>
        </div>
      </div>
    </div>
  );
};

export default UnansweredAnalytics;
