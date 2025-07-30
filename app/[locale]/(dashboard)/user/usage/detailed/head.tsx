"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Field from "@/components/ui/field";
import { CalendarIcon, SearchIcon } from "lucide-react";
import usageService, { UsageDetailedFilters } from "@/services/usage.service";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { Download, FilterAltOutlined } from "@mui/icons-material";
import DatePicker from "@/components/ui/date-picker";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { isValidDateRange } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";
import useVocabStore from "@/store/vocab.slice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { useTranslations } from "next-intl";
import { defaultFilters } from "./table";

// 30 days ago
const defaultFromDate = new Date();
// today
const defaultToDate = new Date();

type DetailedUsageHeadProps = {
  filters: UsageDetailedFilters;
  setFilters: React.Dispatch<React.SetStateAction<UsageDetailedFilters>>;
};
const DetailedUsageHead = ({ filters, setFilters }: DetailedUsageHeadProps) => {
  const { toast } = useToast();
  const { packages, accounts } = useVocabStore();
  const { table } = usePaginatedTable();

  const [accountId, setAccountId] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [packageId, setPackageId] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>(
    filters.fromDate || defaultFromDate
  );
  const [toDate, setToDate] = useState<Date>(filters.toDate || defaultToDate);
  const [search, setSearch] = useState<string>("");

  const [isExporting, setIsExporting] = useState(false);

  const t = useTranslations("usage.detailed");
  const tUsageCommon = useTranslations("usage.common");
  const tCommon = useTranslations("common");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setFilters((prev) => ({
      ...prev,
      codeName: e.target.value,
    }));
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setAccountId("");
    setOrigin("");
    setPackageId("");
    setFromDate(defaultFromDate);
    setToDate(defaultToDate);
    setSearch("");
  };

  const applyFilters = () => {
    const isValid = isValidDateRange(
      fromDate,
      toDate,
      (message) => {
        toast({
          title: t("messages.invalidDateRange"),
          description: message,
          variant: "destructive",
        });
      },
      30, // max 30 days range
      tCommon
    );

    if (!isValid) return;

    table.setPageIndex(0);

    setFilters((prev) => ({
      ...prev,
      accountId: accountId || "",
      origin: origin || "",
      packageId: packageId || "",
      fromDate: fromDate,
      toDate: toDate,
    }));
  };

  const exportUsage = async () => {
    try {
      setIsExporting(true);
      await usageService.exportUsageDetailed(filters);
      toast({
        title: t("messages.exportStarted"),
        description: t("messages.exportStartedDescription"),
      });
    } catch (error) {
      let message = tUsageCommon("unknownError");
      if (isAxiosError(error)) {
        message = error?.response?.data.message || t("messages.exportError");
      }
      toast({
        title: t("messages.exportError"),
        description: message,
        variant: "destructive",
      });
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Collapsible>
      <div className="usage-detailed-table-head flex items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <div className="actions flex items-center gap-2">
          <Field preIcon={<SearchIcon />}>
            <Input
              variant="field"
              placeholder={t("actions.search")}
              value={search}
              onChange={handleSearchChange}
              type="search"
            />
          </Field>
          <CollapsibleTrigger asChild>
            <Toggle pressed={true} className="rounded-full">
              <FilterAltOutlined />
            </Toggle>
          </CollapsibleTrigger>
          <Button
            size="icon"
            variant="ghost"
            onClick={exportUsage}
            loading={isExporting}
          >
            <Download />
          </Button>
        </div>
      </div>
      <CollapsibleContent>
        <FilterBar onClear={handleClearFilters}>
          <FilterBox
            triggerLabel={t("filters.account.triggerLabel")}
            label={t("filters.account.label")}
            onReset={() => {
              setFilters((prev) => ({ ...prev, accountId: "" }));
              setAccountId("");
            }}
            onApply={applyFilters}
            numberOfFilters={accountId ? 1 : 0}
          >
            <Select onValueChange={setAccountId} value={accountId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("filters.account.label")} />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterBox>
          <FilterBox
            triggerLabel={t("filters.origin.triggerLabel")}
            label={t("filters.origin.triggerLabel")}
            onReset={() => {
              setFilters((prev) => ({ ...prev, origin: "" }));
              setOrigin("");
            }}
            onApply={applyFilters}
            numberOfFilters={origin ? 1 : 0}
          >
            <RadioGroup
              defaultValue=""
              onValueChange={setOrigin}
              value={origin}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="orig" id="orig" />
                <Label htmlFor="orig">{t("origin.outgoing")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="term" id="term" />
                <Label htmlFor="term">{t("origin.incoming")}</Label>
              </div>
            </RadioGroup>
          </FilterBox>
          <FilterBox
            triggerLabel={t("filters.package.triggerLabel")}
            label={t("filters.package.label")}
            onReset={() => {
              setFilters((prev) => ({ ...prev, packageId: "" }));
              setPackageId("");
            }}
            onApply={applyFilters}
            numberOfFilters={packageId ? 1 : 0}
          >
            <Select onValueChange={setPackageId} value={packageId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("filters.package.label")} />
              </SelectTrigger>
              <SelectContent>
                {packages?.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id.toString()}>
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterBox>
          <FilterBox
            triggerLabel={t("filters.dateRange.triggerLabel")}
            label={t("filters.dateRange.label")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                fromDate: defaultToDate,
                toDate: defaultToDate,
              }));
              setFromDate(defaultFromDate);
              setToDate(defaultToDate);
            }}
            onApply={applyFilters}
            numberOfFilters={(fromDate ? 1 : 0) + (toDate ? 1 : 0)}
          >
            <Field
              label={tUsageCommon("filters.fromDate.label")}
              hint={tUsageCommon("filters.fromDate.hint")}
              postIcon={<CalendarIcon className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder={tUsageCommon("filters.fromDate.placeholder")}
                value={fromDate}
                onChange={(date) => setFromDate(date || defaultFromDate)}
              />
            </Field>
            <Field
              label={tUsageCommon("filters.toDate.label")}
              hint={tUsageCommon("filters.toDate.hint")}
              postIcon={<CalendarIcon className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder={tUsageCommon("filters.toDate.placeholder")}
                value={toDate}
                onChange={(date) => setToDate(date || defaultToDate)}
              />
            </Field>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DetailedUsageHead;
