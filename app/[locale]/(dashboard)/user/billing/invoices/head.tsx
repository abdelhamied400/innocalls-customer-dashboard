"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import { CalendarMonth, FilterAltOutlined } from "@mui/icons-material";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { isValidDateRange } from "@/lib/date";
import DatePicker from "@/components/ui/date-picker";
import { useTranslations } from "next-intl";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { defaultFilters } from "./table";

type InvoicesFilters = {
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
  fromTotal?: string | undefined;
  toTotal?: string | undefined;
  status?: "draft" | "overdue" | "paid" | "partially_paid" | null;
};

type InvoiceHeadProps = {
  filters: InvoicesFilters;
  setFilters: React.Dispatch<React.SetStateAction<InvoicesFilters>>;
};
const InvoicesHead = ({ filters, setFilters }: InvoiceHeadProps) => {
  const { toast } = useToast();
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [fromTotal, setFromTotal] = useState<string | undefined>();
  const [toTotal, setToTotal] = useState<string | undefined>();
  const [status, setStatus] = useState<InvoicesFilters["status"]>(null);

  const t = useTranslations("billing.invoices");
  const tCommon = useTranslations("common");
  const tBillingCommon = useTranslations("billing.common");

  const { table } = usePaginatedTable();

  const handleClearFilters = () => {
    setFromDate(new Date());
    setToDate(new Date());
    setFromTotal(undefined);
    setToTotal(undefined);
    setStatus(null);
    setFilters(defaultFilters);

    table.setPageIndex(0); // Reset to first page on clear filters
  };

  const applyFilters = () => {
    const isValid = isValidDateRange(
      fromDate,
      toDate,
      (message) => {
        toast({
          title: tBillingCommon("messages.invalidDateRange"),
          description: message,
          variant: "destructive",
        });
      },
      -1
    );

    let hasValidTotalRange = true;

    if (fromTotal) {
      const fromTotalNum = parseFloat(fromTotal);
      if (isNaN(fromTotalNum) || fromTotalNum < 0) {
        toast({
          title: tBillingCommon("messages.invalidFromTotal"),
          description: tBillingCommon("messages.invalidFromTotalHint"),
          variant: "destructive",
        });
        hasValidTotalRange = false;
      }
    }
    if (toTotal) {
      const toTotalNum = parseFloat(toTotal);
      if (isNaN(toTotalNum) || toTotalNum < 0) {
        toast({
          title: tBillingCommon("messages.invalidToTotal"),
          description: tBillingCommon("messages.invalidToTotalHint"),
          variant: "destructive",
        });
        hasValidTotalRange = false;
      }
    }
    if (fromTotal && toTotal && parseFloat(fromTotal) > parseFloat(toTotal)) {
      toast({
        title: tBillingCommon("messages.invalidTotalRange"),
        description: tBillingCommon("messages.invalidTotalRangeHint"),
        variant: "destructive",
      });
      hasValidTotalRange = false;
    }

    if (!isValid || !hasValidTotalRange) return;

    setFilters((prev) => ({
      ...prev,
      fromDate: fromDate,
      toDate: toDate,
      fromTotal: fromTotal?.trim(),
      toTotal: toTotal?.trim(),
      status: status || null,
    }));
  };

  return (
    <Collapsible>
      <div className="table-head flex flex-wrap items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <div className="actions flex flex-wrap items-center gap-2">
          <CollapsibleTrigger asChild>
            <Toggle pressed={true} className="rounded-full">
              <FilterAltOutlined />
            </Toggle>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        <FilterBar onClear={handleClearFilters}>
          <FilterBox
            triggerLabel={tBillingCommon("filters.creationDate.label")}
            label={tBillingCommon("filters.creationDate.placeholder")}
            onReset={() => {
              setFromDate(undefined);
              setToDate(undefined);
              setFilters((prev) => ({
                ...prev,
                fromDate: undefined,
                toDate: undefined,
              }));
            }}
            onApply={applyFilters}
          >
            <Field
              label={tBillingCommon("filters.fromDate.label")}
              hint={tBillingCommon("filters.fromDate.hint")}
              postIcon={<CalendarMonth className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder={tBillingCommon("filters.fromDate.placeholder")}
                value={fromDate}
                onChange={setFromDate}
              />
            </Field>
            <Field
              label={tBillingCommon("filters.toDate.label")}
              hint={tBillingCommon("filters.toDate.hint")}
              postIcon={<CalendarMonth className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder={tBillingCommon("filters.toDate.placeholder")}
                value={toDate}
                onChange={setToDate}
              />
            </Field>
          </FilterBox>
          <FilterBox
            triggerLabel={t("filters.amount.triggerLabel")}
            label={t("filters.amount.label")}
            onReset={() => {
              setFromTotal(undefined);
              setToTotal(undefined);
              setFilters((prev) => ({
                ...prev,
                fromTotal: undefined,
                toTotal: undefined,
              }));
            }}
            onApply={applyFilters}
          >
            <Field label={t("filters.amount.from.label")}>
              <Input
                variant="field"
                type="number"
                placeholder={t("filters.amount.from.placeholder")}
                value={fromTotal || ""}
                onChange={(e) => setFromTotal(e.target.value)}
              />
            </Field>
            <Field label={t("filters.amount.to.label")}>
              <Input
                variant="field"
                type="number"
                placeholder={t("filters.amount.to.placeholder")}
                value={toTotal || ""}
                onChange={(e) => setToTotal(e.target.value)}
              />
            </Field>
          </FilterBox>
          <FilterBox
            triggerLabel={t("filters.status.triggerLabel")}
            label={t("filters.status.label")}
            onReset={() => {
              setStatus(null);
              setFilters((prev) => ({ ...prev, status: null }));
            }}
            onApply={applyFilters}
          >
            <RadioGroup
              onValueChange={(status) =>
                setStatus(status as InvoicesFilters["status"])
              }
              value={status}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draft" id="draft" />
                <Label htmlFor="draft">{t("status.draft")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="overdue" id="overdue" />
                <Label htmlFor="overdue">{t("status.overdue")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid">{t("status.paid")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partially_paid" id="partially_paid" />
                <Label htmlFor="partially_paid">
                  {t("status.partially_paid")}
                </Label>
              </div>
            </RadioGroup>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default InvoicesHead;
