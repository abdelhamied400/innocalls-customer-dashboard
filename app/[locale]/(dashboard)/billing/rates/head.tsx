"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Field from "@/components/ui/field";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import billingService from "@/services/billing.service";
import { FilterAltOutlined, Search } from "@mui/icons-material";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterDialog from "@/components/FilterDialog";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "next-intl";
import { FilterBox } from "@/components/FilterBox";
import { FilterBar } from "@/components/FilterBar";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";

type RatesFilters = {
  search: string;
  serviceId?: string;
};
type RatesHeadProps = {
  filters: RatesFilters;
  setFilters: React.Dispatch<React.SetStateAction<RatesFilters>>;
};
const RatesHead = ({ filters, setFilters }: RatesHeadProps) => {
  const { table } = usePaginatedTable();

  const t = useTranslations("billing.rates");
  const tCommon = useTranslations("common");

  const [search, setSearch] = useState<string>(filters.search);
  const [serviceId, setServiceId] = useState<string | undefined>(
    filters.serviceId
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      search: search,
      serviceId: serviceId || "1",
    }));
    table.setPageIndex(0); // Reset to first page on filter change
  };

  return (
    <Collapsible>
      <div className="users-table-head flex items-center justify-between p-4">
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
            setFilters((prev) => ({ ...prev, serviceId: "1" }));
            setServiceId("1");
            setSearch("");

            table.setPageIndex(0); // Reset to first page on filter change
          }}
        >
          <FilterBox
            triggerLabel={t("filters.service.label")}
            label={t("filters.service.placeholder")}
            onReset={() => {
              setFilters((prev) => ({ ...prev, serviceId: "1" }));
              setServiceId("1");
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
          >
            <RadioGroup onValueChange={setServiceId} value={serviceId || "1"}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="calls" />
                <Label htmlFor="calls">{t("services.calls")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="sms" />
                <Label htmlFor="sms">{t("services.sms")}</Label>
              </div>
            </RadioGroup>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default RatesHead;
