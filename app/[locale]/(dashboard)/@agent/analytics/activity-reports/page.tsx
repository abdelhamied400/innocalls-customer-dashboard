"use client";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import Field from "@/components/ui/field";
import { useFilterManager } from "@/hooks/useFilterManager";
import { activityReportsFiltersSchema } from "@/validation/activityReportsFilters";
import { BarChart, Search } from "@mui/icons-material";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type ActivityReportsFilters = {
  fromDate: Date | null;
  toDate: Date | null;
};

const today = new Date();
const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

const ActivityReports = () => {
  const t = useTranslations("analytics.activityReports");
  const tCommon = useTranslations("analytics.common");

  const activityReportsFilterConfig = {
    defaultValues: {
      fromDate: lastMonth,
      toDate: today,
    } as ActivityReportsFilters,
    schema: activityReportsFiltersSchema(t, tCommon),
  };

  const { values, appliedValues, errors, setValue, reset, apply } =
    useFilterManager<ActivityReportsFilters>(activityReportsFilterConfig);

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
      </div>
    </div>
  );
};

export default ActivityReports;
