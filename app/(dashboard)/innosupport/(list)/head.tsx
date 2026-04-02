import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import FilterAltIcon from "@mui/icons-material/FilterAltOutlined";
import { useTranslations } from "@/providers/TranslationProvider";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import ticketsService, {
  Department,
  TicketFilters,
} from "@/services/tickets.service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDebounce from "@/hooks/use-debounce";

const ticketStatuses = [
  { label: "Open", value: "Open" },
  { label: "Closed", value: "Closed" },
];

interface TicketsTableHeaderProps {
  filters: TicketFilters;
  setFilters: React.Dispatch<React.SetStateAction<TicketFilters>>;
}

const TicketsTableHeader = ({
  filters,
  setFilters,
}: TicketsTableHeaderProps) => {
  const t = useTranslations("innoSupport.list");

  const [status, setStatus] = useState<string>(filters.status || "");
  const [departmentId, setDepartmentId] = useState<string>(
    filters.departmentId || "",
  );
  const [searchTerm, setSearchTerm] = useState<string>(filters.subject || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: departments = [] } = useLocalizedQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: ticketsService.getDepartments,
  });

  const MIN_SEARCH_LENGTH = 3;

  useEffect(() => {
    if (debouncedSearchTerm === (filters.subject || "")) return;
    const trimmed = debouncedSearchTerm.trim();
    if (trimmed.length >= MIN_SEARCH_LENGTH || trimmed.length === 0) {
      setFilters((prev) => ({
        ...prev,
        subject: trimmed || undefined,
        page: 1,
      }));
    }
  }, [debouncedSearchTerm]);

  return (
    <Collapsible>
      <div className="flex flex-wrap items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <TooltipProvider>
          <div className="actions flex flex-wrap items-center gap-2">
            <div className="relative">
              <Field preIcon={<SearchIcon />}>
                <Input
                  variant="field"
                  placeholder={t("filters.subjectPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="search"
                />
              </Field>
              {searchTerm.length > 0 &&
                searchTerm.length < MIN_SEARCH_LENGTH && (
                  <p className="absolute text-xs text-muted-foreground mt-1">
                    {t("filters.searchMinChars")}
                  </p>
                )}
            </div>

            <Tooltip>
              <CollapsibleTrigger asChild>
                <TooltipTrigger asChild>
                  <Toggle pressed={true} className="rounded-full">
                    <FilterAltIcon />
                  </Toggle>
                </TooltipTrigger>
              </CollapsibleTrigger>
              <TooltipContent>
                <p>{t("tooltips.toggleFilters")}</p>
              </TooltipContent>
            </Tooltip>

            <Link href="/innosupport/create">
              <Button>{t("actions.create")}</Button>
            </Link>
          </div>
        </TooltipProvider>
      </div>
      <CollapsibleContent>
        <FilterBar
          onClear={() => {
            setStatus("");
            setDepartmentId("");
            setSearchTerm("");
            setFilters({
              page: 1,
              perPage: filters.perPage,
            });
          }}
        >
          <FilterBox
            triggerLabel={t("filters.status")}
            label={t("filters.selectFromList")}
            onReset={() => {
              setStatus("");
              setFilters((prev) => ({
                ...prev,
                status: undefined,
                page: 1,
              }));
            }}
            onApply={() => {
              setFilters((prev) => ({
                ...prev,
                status: status || undefined,
                page: 1,
              }));
              return true;
            }}
            numberOfFilters={status ? 1 : 0}
          >
            <RadioGroup
              value={status}
              onValueChange={(value: string) => setStatus(value)}
            >
              {ticketStatuses.map((s) => (
                <div className="flex items-center gap-2" key={s.value}>
                  <RadioGroupItem value={s.value} id={`status-${s.value}`} />
                  <Label htmlFor={`status-${s.value}`}>
                    {t(`status.${s.value}`)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FilterBox>

          <FilterBox
            triggerLabel={t("filters.department")}
            label={t("filters.selectFromList")}
            onReset={() => {
              setDepartmentId("");
              setFilters((prev) => ({
                ...prev,
                departmentId: undefined,
                page: 1,
              }));
            }}
            onApply={() => {
              setFilters((prev) => ({
                ...prev,
                departmentId: departmentId || undefined,
                page: 1,
              }));
              return true;
            }}
            numberOfFilters={departmentId ? 1 : 0}
          >
            <RadioGroup
              value={departmentId}
              onValueChange={(value: string) => setDepartmentId(value)}
            >
              {departments.map((dept) => (
                <div className="flex items-center gap-2" key={dept.id}>
                  <RadioGroupItem value={dept.id} id={`dept-${dept.id}`} />
                  <Label htmlFor={`dept-${dept.id}`}>{dept.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TicketsTableHeader;
