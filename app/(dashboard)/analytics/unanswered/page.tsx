"use client";

import React, { useEffect } from "react";
import { BarChart, CalendarMonth, Clear, Insights } from "@mui/icons-material";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import Field from "@/components/ui/field";
import DatePicker from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Select from "@/components/select";
import { useFilterManager } from "@/hooks/useFilterManager";
import { unansweredFiltersSchema } from "@/validation/unansweredFilters";
import InboundDistribution from "./inbound-distribution";
import InboundUnansweredHourly from "./inbound-hourly";
import OutboundDistribution from "./outbound-distribution";
import OutboundUnansweredHourly from "./outbound-hourly";
import QuickStats from "./quick-stats";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useVocab } from "@/hooks/useVocab";
import { FilterBox } from "@/components/FilterBox";
import { formatDate } from "@/lib/date";

type Option = {
  value: string;
  label: string;
};

export type UnansweredAnalyticsFilters = {
  fromDate: Date;
  toDate: Date;
  agents: Option[];
  includeInternalCalls: boolean;
};

const today = new Date();
const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

const UnansweredAnalytics = () => {
  const { extensions } = useVocab();
  const { setPageTitle } = useAppStore();
  const locale = useLocale();

  const t = useTranslations("analytics.unanswered");
  const tCommon = useTranslations("analytics.common");
  const tShared = useTranslations("common");

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
      includeInternalCalls: false,
    } as UnansweredAnalyticsFilters,
    schema: unansweredFiltersSchema(tCommon),
  };

  const { values, appliedValues, errors, setValue, reset, apply } =
    useFilterManager<UnansweredAnalyticsFilters>(unansweredFilterConfig);

  return (
    <div className="page" id="unanswered-analytics">
      <div className="flex flex-col gap-2">
        <div className="filters p-2 border rounded-xl flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <FilterBox
              triggerLabel={tCommon("fromTo", {
                from: formatDate(values.fromDate),
                to: formatDate(values.toDate),
              })}
              label={tCommon("form.fields.date.label")}
              onApply={apply}
              onReset={() => {
                setValue(
                  "fromDate",
                  unansweredFilterConfig.defaultValues.fromDate
                );
                setValue("toDate", unansweredFilterConfig.defaultValues.toDate);
                apply();
              }}
            >
              <div className="flex flex-col gap-4">
                <Field
                  label={tCommon("form.fields.fromDate.label")}
                  postIcon={<CalendarMonth className="text-gray-400" />}
                  error={errors.fromDate}
                >
                  <DatePicker
                    className="min-w-36 flex-1"
                    placeholder={tCommon("form.fields.fromDate.placeholder")}
                    value={values.fromDate}
                    onChange={(date) =>
                      setValue("fromDate", date || new Date())
                    }
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
              </div>
            </FilterBox>
            <FilterBox
              triggerLabel={tCommon("form.fields.agents.label")}
              label={tCommon("form.fields.agents.label")}
              onApply={apply}
              onReset={() => {
                setValue("agents", unansweredFilterConfig.defaultValues.agents);
                apply();
              }}
            >
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
            </FilterBox>
          </div>
          <Button onClick={reset} variant="ghost">
            <Clear />
            {tShared("actions.reset")}
          </Button>
        </div>

        <QuickStats filters={appliedValues} />

        <div className="analytics-tabs">
          <Tabs defaultValue="inbound" className="w-full border rounded-xl">
            <TabsList className="border-b p-3">
              <TabsTrigger value="inbound">{t("tabs.inbound")}</TabsTrigger>
              <TabsTrigger value="outbound">{t("tabs.outbound")}</TabsTrigger>
            </TabsList>

            <TabsContent value="inbound" className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b p-3">
                <Switch
                  id="includeInternalCalls"
                  checked={values.includeInternalCalls}
                  onCheckedChange={(value) => {
                    setValue("includeInternalCalls", value);
                    apply();
                  }}
                />
                <Label htmlFor="includeInternalCalls">
                  {t("filters.includeInternalCalls.label")}
                </Label>
              </div>
              <div className="px-3">
                <InboundDistribution filters={appliedValues} />
                <InboundUnansweredHourly filters={appliedValues} />
              </div>
            </TabsContent>

            <TabsContent value="outbound" className="flex flex-col gap-4">
              <OutboundDistribution filters={appliedValues} />
              <OutboundUnansweredHourly filters={appliedValues} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UnansweredAnalytics;
