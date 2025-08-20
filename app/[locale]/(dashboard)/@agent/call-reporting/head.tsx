"use client";

import callReportingService from "@/services/call-reporting.service";
import { AgentCallReportingFilters, Option } from "@/types/api/call-reporting";
import { useState } from "react";
import Field from "@/components/ui/field";
import { FilterAltOutlined } from "@mui/icons-material";
import MultiSelect from "@/components/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import DatePicker from "@/components/ui/date-picker";
import useVocabStore from "@/store/vocab.slice";
import { isValidDateRange } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type CallReportingHeadProps = {
  filters: AgentCallReportingFilters;
  setFilters: React.Dispatch<React.SetStateAction<AgentCallReportingFilters>>;
};
const CallReportingHead = ({ filters, setFilters }: CallReportingHeadProps) => {
  const { toast } = useToast();
  const t = useTranslations("callReporting");
  const tCommon = useTranslations("common");

  const { table } = usePaginatedTable();
  const [isExporting, setIsExporting] = useState(false);
  const { data: session } = useSession();
  const { extensions, tags } = useVocabStore();
  const extensionsOptions = extensions?.map((ext) => ({
    label: `${ext.name} (${ext.ext})`,
    value: ext.ext,
  }));
  const tagsOptions = tags.map((tag) => ({
    label: tag.name,
    value: tag.id,
  }));
  const directionsOptions = [
    { value: "local", label: "local" },
    { value: "incoming", label: "incoming" },
    { value: "outgoing", label: "outgoing" },
  ];

  const [fromDate, setFromDate] = useState<Date | undefined>(
    filters.fromDate ? new Date(filters.fromDate) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    filters.toDate ? new Date(filters.toDate) : undefined
  );
  const [numbers, setNumbers] = useState<Option[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [direction, setDirection] = useState<string>("all");
  const [answeredFilter, setAnsweredFilter] = useState<string>("both");

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await callReportingService.exportCallReporting({
        ...filters,
        userEmail: session?.user?.email || "",
      });

      toast({
        title: t("export.title"),
        description: t("export.description"),
      });
    } catch (error) {
      let message = t("messages.unexpectedError");
      if (isAxiosError(error)) {
        message = error?.response?.data.message;
      }
      toast({
        title: t("export.description"),
        description: message,
        variant: "destructive",
      });
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const applyFilters = () => {
    const isValid = isValidDateRange(
      fromDate,
      toDate,
      (message) => {
        toast({
          title: "Invalid date range",
          description: message,
          variant: "destructive",
        });
      },
      -1,
      tCommon
    );

    if (!isValid) return;

    setFilters((prev) => ({
      ...prev,
      fromDate: fromDate,
      toDate: toDate,
      numbers:
        numbers.length > 0
          ? numbers.map((ext) => ext.value).join(",")
          : undefined,
      tags:
        selectedTags.length > 0
          ? selectedTags.map((tag) => tag.value).join(",")
          : undefined,
      direction:
        direction === "all"
          ? undefined
          : (direction as "local" | "incoming" | "outgoing"),
      isAnswered:
        answeredFilter === "both" ? undefined : answeredFilter === "answered",
    }));

    table.setPageIndex(0); // Reset to first page on filter change
  };

  return (
    <Collapsible>
      <div className="call-reporting-table-head flex items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <div className="flex items-center gap-2">
          <div className="actions flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Toggle pressed={true} className="rounded-full">
                <FilterAltOutlined />
              </Toggle>
            </CollapsibleTrigger>
            <Button
              variant="default"
              onClick={handleExport}
              loading={isExporting}
            >
              {t("export.button")}
            </Button>
          </div>
        </div>
      </div>
      <CollapsibleContent className="">
        <FilterBar
          onClear={() => {
            setFilters({});
            setFromDate(undefined);
            setToDate(undefined);
            setNumbers([]);
            setSelectedTags([]);
            setDirection("all");
            setAnsweredFilter("both");
            table.setPageIndex(0); // Reset to first page on filter change
          }}
        >
          <FilterBox
            triggerLabel={t("filters.callDate.triggerLabel")}
            label={t("filters.callDate.label")}
            onReset={() => {
              setFilters({
                ...filters,
                fromDate: undefined,
                toDate: undefined,
              });
              setFromDate(undefined);
              setToDate(undefined);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
            numberOfFilters={(fromDate ? 1 : 0) + (toDate ? 1 : 0)}
          >
            <Field
              label={t("filters.fromDate.label")}
              hint={t("filters.fromDate.hint")}
              postIcon={<Calendar className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder={t("filters.fromDate.placeholder")}
                value={fromDate}
                onChange={setFromDate}
              />
            </Field>
            <Field
              label={t("filters.toDate.label")}
              hint={t("filters.toDate.hint")}
              postIcon={<Calendar className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder={t("filters.toDate.placeholder")}
                value={toDate}
                onChange={setToDate}
              />
            </Field>
          </FilterBox>
          <FilterBox
            triggerLabel={t("filters.numbers.triggerLabel")}
            label={t("filters.numbers.label")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                numbers: [],
              }));
              setNumbers([]);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
            numberOfFilters={numbers.length}
          >
            <MultiSelect
              isCreatable
              options={extensionsOptions}
              onChange={(exs) => setNumbers(exs || [])}
              value={numbers}
              isMulti
              badgeClassName="text-xs"
              getLabel={(option) => option?.label || ""}
              getValue={(option) => option?.value || ""}
              onCreateOption={(newOption) => {
                // accept only numbers
                if (/^\d+$/.test(newOption)) {
                  const newExt = { label: newOption, value: newOption };
                  setNumbers((prev) => [...prev, newExt]);
                  return newExt;
                }
                toast({
                  title: t("filters.validation.number.invalid"),
                  description: t(
                    "filters.validation.number.invalidDescription"
                  ),
                  variant: "destructive",
                });
                return false;
              }}
            />
          </FilterBox>
          <FilterBox
            triggerLabel={t("filters.tags.triggerLabel")}
            label={t("filters.tags.triggerLabel")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                tags: [],
              }));
              setSelectedTags([]);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
            numberOfFilters={selectedTags.length}
          >
            <MultiSelect
              options={tagsOptions}
              onChange={(tags) => setSelectedTags(tags || [])}
              value={selectedTags}
              isMulti
              badgeClassName="text-xs"
              getLabel={(option) => option?.label || ""}
              getValue={(option) => option?.value || ""}
            />
          </FilterBox>

          {/* direction radio buttons */}
          <FilterBox
            triggerLabel={t("filters.direction.triggerLabel")}
            label={t("filters.direction.label")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                direction: undefined,
              }));
              setDirection("all");
              table.setPageIndex(0);
            }}
            onApply={applyFilters}
            numberOfFilters={direction !== "all" ? 1 : 0}
          >
            <RadioGroup
              value={direction}
              onValueChange={setDirection}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-directions" />
                <Label htmlFor="all-directions">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="local" id="local" />
                <Label htmlFor="local">Local</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="incoming" id="incoming" />
                <Label htmlFor="incoming">Incoming</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outgoing" id="outgoing" />
                <Label htmlFor="outgoing">Outgoing</Label>
              </div>
            </RadioGroup>
          </FilterBox>

          {/* isAnswered radio buttons */}
          <FilterBox
            triggerLabel={t("filters.isAnswered.triggerLabel")}
            label={t("filters.isAnswered.label")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                isAnswered: undefined,
              }));
              setAnsweredFilter("both");
              table.setPageIndex(0);
            }}
            onApply={applyFilters}
            numberOfFilters={answeredFilter !== "both" ? 1 : 0}
          >
            <RadioGroup
              value={answeredFilter}
              onValueChange={setAnsweredFilter}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">Both</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="answered" id="answered" />
                <Label htmlFor="answered">Answered</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-answered" id="not-answered" />
                <Label htmlFor="not-answered">Not Answered</Label>
              </div>
            </RadioGroup>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CallReportingHead;
