"use client";

import { useState } from "react";
import Field from "@/components/ui/field";
import { CalendarIcon } from "lucide-react";
import { FilterAltOutlined } from "@mui/icons-material";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import DatePicker from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { isValidDateRange } from "@/lib/date";
import { useTranslations } from "next-intl";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";

// 30 days ago
const defaultFromDate = new Date();
defaultFromDate.setDate(defaultFromDate.getDate() - 30);
// today
const defaultToDate = new Date();

type PaymentHistoryFilters = {
  fromDate?: Date;
  toDate?: Date;
};

type PaymentHistoryHeadProps = {
  filters: PaymentHistoryFilters;
  setFilters: React.Dispatch<React.SetStateAction<PaymentHistoryFilters>>;
};
const PaymentHistoryHead = ({
  filters,
  setFilters,
}: PaymentHistoryHeadProps) => {
  const t = useTranslations("billing.paymentHistory");
  const tCommon = useTranslations("common");
  const tBillingCommon = useTranslations("billing.common");

  const { toast } = useToast();
  const { table } = usePaginatedTable();

  const [fromDate, setFromDate] = useState<Date | undefined>(defaultFromDate);
  const [toDate, setToDate] = useState<Date | undefined>(defaultToDate);

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
      90,
      tCommon
    );

    if (!isValid) return;

    setFilters((prev) => ({
      ...prev,
      fromDate,
      toDate,
    }));

    table.setPageIndex(0); // Reset to first page on filter change
  };

  return (
    <Collapsible>
      <div className="users-table-head flex items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <div className="actions flex items-center gap-2">
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
            setFilters({
              fromDate: defaultFromDate,
              toDate: defaultToDate,
            });
            setFromDate(defaultFromDate);
            setToDate(defaultToDate);
            table.setPageIndex(0); // Reset to first page on filter change
          }}
        >
          <FilterBox
            triggerLabel={tBillingCommon("filters.creationDate.label")}
            label={tBillingCommon("filters.creationDate.placeholder")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                fromDate: defaultFromDate,
                toDate: defaultToDate,
              }));
              setFromDate(defaultFromDate);
              setToDate(defaultToDate);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
          >
            <Field
              label={tBillingCommon("filters.fromDate.label")}
              hint={tBillingCommon("filters.fromDate.hint")}
              postIcon={<CalendarIcon className="text-gray-400" />}
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
              postIcon={<CalendarIcon className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder={tBillingCommon("filters.toDate.placeholder")}
                value={toDate}
                onChange={setToDate}
              />
            </Field>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PaymentHistoryHead;
