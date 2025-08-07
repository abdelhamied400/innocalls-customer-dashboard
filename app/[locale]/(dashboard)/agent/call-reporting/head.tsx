"use client";

import callReportingService from "@/services/call-reporting.service";
import { CallReportingFilters, Option } from "@/types/api/call-reporting";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { useTranslations } from "next-intl";

type CallReportingHeadProps = {
  filters: CallReportingFilters;
  setFilters: React.Dispatch<React.SetStateAction<CallReportingFilters>>;
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
    label: tag.nameEN,
    value: tag.id,
  }));
  const statusesOptions = [
    { value: "ANSWERED", label: "answered" },
    { value: "FAILED", label: "failed" },
    { value: "NO ANSWER", label: "notAnswered" },
    { value: "BUSY", label: "busy" },
  ];

  const [fromDate, setFromDate] = useState<Date | undefined>(
    filters.fromDate ? new Date(filters.fromDate) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    filters.toDate ? new Date(filters.toDate) : undefined
  );
  const [sourceExtensions, setSourceExtensions] = useState<Option[]>([]);
  const [destinationExtensions, setDestinationExtensions] = useState<Option[]>(
    []
  );
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

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
      sourceExtensions:
        sourceExtensions.length > 0
          ? sourceExtensions.map((ext) => ext.value).join(",")
          : undefined,
      destinationExtensions:
        destinationExtensions.length > 0
          ? destinationExtensions.map((ext) => ext.value).join(",")
          : undefined,
      tags:
        selectedTags.length > 0
          ? selectedTags.map((tag) => tag.value).join(",")
          : undefined,
      callStatuses:
        selectedStatuses.length > 0 ? selectedStatuses.join(",") : undefined,
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
            setSourceExtensions([]);
            setDestinationExtensions([]);
            setSelectedTags([]);
            setSelectedStatuses([]);
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
            triggerLabel={t("filters.source.triggerLabel")}
            label={t("filters.source.label")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                sourceExtensions: [],
              }));
              setSourceExtensions([]);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
            numberOfFilters={sourceExtensions.length}
          >
            <MultiSelect
              isCreatable
              options={extensionsOptions}
              onChange={(exs) => setSourceExtensions(exs || [])}
              value={sourceExtensions}
              isMulti
              badgeClassName="text-xs"
              getLabel={(option) => option?.label || ""}
              getValue={(option) => option?.value || ""}
              onCreateOption={(newOption) => {
                // accept only numbers
                if (/^\d+$/.test(newOption)) {
                  const newExt = { label: newOption, value: newOption };
                  setSourceExtensions((prev) => [...prev, newExt]);
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
            triggerLabel={t("filters.destination.triggerLabel")}
            label={t("filters.destination.triggerLabel")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                destinationExtensions: [],
              }));
              setDestinationExtensions([]);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
            numberOfFilters={destinationExtensions.length}
          >
            <MultiSelect
              isCreatable
              options={extensionsOptions}
              onChange={(exs) => setDestinationExtensions(exs || [])}
              value={destinationExtensions}
              isMulti
              badgeClassName="text-xs"
              getLabel={(option) => option?.label || ""}
              getValue={(option) => option?.value || ""}
              onCreateOption={(newOption) => {
                // accept only numbers
                if (/^\d+$/.test(newOption)) {
                  const newExt = { label: newOption, value: newOption };
                  setDestinationExtensions((prev) => [...prev, newExt]);
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
          <FilterBox
            triggerLabel={t("filters.callStatus.triggerLabel")}
            label={t("filters.callStatus.label")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                callStatuses: undefined,
              }));
              setSelectedStatuses([]);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
            numberOfFilters={selectedStatuses.length}
          >
            <div className="flex flex-col gap-2">
              {statusesOptions.map((status) => (
                <div key={status.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`call-status-${status.value}`}
                    checked={selectedStatuses.includes(status.value)}
                    onCheckedChange={(checked) => {
                      setSelectedStatuses((prev) =>
                        checked
                          ? [...prev, status.value]
                          : prev.filter((s) => s !== status.value)
                      );
                    }}
                  />
                  <Label htmlFor={`call-status-${status.value}`}>
                    {t(`status.${status.label}`)}
                  </Label>
                </div>
              ))}
            </div>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CallReportingHead;
