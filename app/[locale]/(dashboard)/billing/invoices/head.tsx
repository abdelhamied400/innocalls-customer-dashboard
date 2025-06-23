"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import { CalendarMonth, FilterAltOutlined, Search } from "@mui/icons-material";
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
import { format, set } from "date-fns";
import { useTranslations } from "next-intl";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";

type InvoicesFilters = {
  search: string;
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
  fromTotal?: string;
  toTotal?: string;
  status?: "draft" | "overdue" | "paid" | "partially_paid" | null;
};

type InvoiceHeadProps = {
  filters: InvoicesFilters;
  setFilters: React.Dispatch<React.SetStateAction<InvoicesFilters>>;
};
const InvoicesHead = ({ filters, setFilters }: InvoiceHeadProps) => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [fromTotal, setFromTotal] = useState<string>("");
  const [toTotal, setToTotal] = useState<string>("");
  const [status, setStatus] = useState<InvoicesFilters["status"]>(null);

  const t = useTranslations("billing.invoices");
  const tCommon = useTranslations("common");
  const tBillingCommon = useTranslations("billing.common");

  const { table } = usePaginatedTable();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
    table.setPageIndex(0); // Reset to first page on search change
  };

  const applyFilters = () => {
    const isValid = isValidDateRange(
      fromDate,
      toDate,
      (message) => {
        toast({
          title: "Invalid Date Range",
          description: message,
          variant: "destructive",
        });
      },
      -1
    );
    if (!isValid) return;

    setFilters((prev) => ({
      ...prev,
      search: search.trim(),
      fromDate: fromDate,
      toDate: toDate,
      fromTotal: fromTotal.trim(),
      toTotal: toTotal.trim(),
      status: status || null,
    }));
  };

  return (
    <Collapsible>
      <div className="table-head flex items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <div className="actions flex items-center gap-2">
          <Field preIcon={<Search />}>
            <Input
              variant="field"
              placeholder={tCommon("search.placeholder")}
              value={filters.search}
              onChange={handleSearchChange}
              type="search"
            />
          </Field>

          <CollapsibleTrigger asChild>
            <Toggle pressed={true} className="rounded-full">
              <FilterAltOutlined />
            </Toggle>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        <FilterBar
          onClear={() => {
            setSearch("");
            setFromDate(undefined);
            setToDate(undefined);
            setFromTotal("");
            setToTotal("");
            setStatus(null);
            setFilters({
              search: "",
              fromDate: undefined,
              toDate: undefined,
              fromTotal: "",
              toTotal: "",
              status: null,
            });
          }}
        >
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
              setFromTotal("");
              setToTotal("");
              setFilters((prev) => ({
                ...prev,
                fromTotal: "",
                toTotal: "",
              }));
            }}
            onApply={applyFilters}
          >
            <Field label={t("filters.amount.from.label")}>
              <Input
                variant="field"
                type="number"
                placeholder={t("filters.amount.from.placeholder")}
                value={fromTotal}
                onChange={(e) => setFromTotal(e.target.value)}
              />
            </Field>
            <Field label={t("filters.amount.to.label")}>
              <Input
                variant="field"
                type="number"
                placeholder={t("filters.amount.to.placeholder")}
                value={toTotal}
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
              value={filters.status}
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
