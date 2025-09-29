"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  CalendarMonth,
  Clear,
  Insights,
  Search,
} from "@mui/icons-material";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import Field from "@/components/ui/field";
import DatePicker from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  const [agentSearch, setAgentSearch] = useState("");

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

  const { values, appliedValues, errors, setValue, reset, apply, applyValues } =
    useFilterManager<UnansweredAnalyticsFilters>(unansweredFilterConfig);

  // Filter extensions based on search
  const filteredExtensions =
    extensions?.filter(
      (ext) =>
        ext.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
        ext.ext.toLowerCase().includes(agentSearch.toLowerCase())
    ) || [];

  return (
    <div className="page" id="unanswered-analytics">
      <div className="flex flex-col gap-2">
        <div className="filters p-2 border rounded-xl flex items-center justify-between flex-wrap">
          <div className="flex flex-wrap items-center gap-2">
            <FilterBox
              triggerLabel={
                <p className="font-normal">
                  {tCommon("from")}{" "}
                  <b>{formatDate(values.fromDate, { locale: locale })}</b>
                  {tCommon("to")}{" "}
                  <b>{formatDate(values.toDate, { locale: locale })}</b>
                </p>
              }
              label={tCommon("form.fields.date.label")}
              onApply={apply}
              onReset={() => {
                applyValues({
                  fromDate: unansweredFilterConfig.defaultValues.fromDate,
                  toDate: unansweredFilterConfig.defaultValues.toDate,
                });
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
                applyValues({
                  agents: unansweredFilterConfig.defaultValues.agents,
                });
              }}
            >
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Input
                    placeholder={tCommon("form.fields.agents.placeholder")}
                    value={agentSearch}
                    onChange={(e) => setAgentSearch(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {filteredExtensions.map((ext) => (
                    <div
                      key={ext.ext}
                      className="flex items-center gap-2 border-b last:border-0 py-1"
                    >
                      <Checkbox
                        id={`agent-${ext.ext}`}
                        checked={values.agents.some(
                          (agent) => agent.value === ext.ext
                        )}
                        onCheckedChange={(checked) => {
                          const isChecked = Boolean(checked);
                          const newAgents = isChecked
                            ? [
                                ...values.agents,
                                {
                                  value: ext.ext,
                                  label: `${ext.name} (${ext.ext})`,
                                },
                              ]
                            : values.agents.filter(
                                (agent) => agent.value !== ext.ext
                              );
                          setValue("agents", newAgents);
                        }}
                      />
                      <Label
                        htmlFor={`agent-${ext.ext}`}
                        className="text-sm font-normal"
                      >
                        {ext.name} ({ext.ext})
                      </Label>
                    </div>
                  ))}
                  {filteredExtensions.length === 0 &&
                    extensions &&
                    extensions.length > 0 && (
                      <p className="text-sm text-gray-500">
                        No agents match your search.
                      </p>
                    )}
                  {extensions?.length === 0 && (
                    <p className="text-sm text-gray-500">
                      {tCommon("form.fields.agents.noOptions")}
                    </p>
                  )}
                </div>
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
                    applyValues({ includeInternalCalls: value });
                  }}
                />
                <Label htmlFor="includeInternalCalls">
                  {t("filters.includeInternalCalls.label")}
                </Label>
              </div>
              <div className="px-3 flex flex-col gap-4">
                <InboundDistribution filters={appliedValues} />
                <InboundUnansweredHourly filters={appliedValues} />
              </div>
            </TabsContent>

            <TabsContent value="outbound" className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b p-3">
                <Switch
                  id="includeInternalCalls"
                  checked={values.includeInternalCalls}
                  onCheckedChange={(value) => {
                    applyValues({ includeInternalCalls: value });
                  }}
                />
                <Label htmlFor="includeInternalCalls">
                  {t("filters.includeInternalCalls.label")}
                </Label>
              </div>
              <div className="px-3 flex flex-col gap-4">
                <OutboundDistribution filters={appliedValues} />
                <OutboundUnansweredHourly filters={appliedValues} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UnansweredAnalytics;
