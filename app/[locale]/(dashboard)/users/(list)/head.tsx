import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Link from "next/link";
import { useTranslations } from "next-intl";
import useAuthStore from "@/store/auth.slice";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { userStatuses } from "@/constants/user";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface UsersTableHeaderProps {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const UsersTableHeader = ({ filters, setFilters }: UsersTableHeaderProps) => {
  const t = useTranslations("users.list");
  const commonT = useTranslations("common.search");
  const { Organization } = useAuthStore();

  const [status, setStatus] = useState<string[]>(
    filters.status
      ? Array.isArray(filters.status)
        ? filters.status
        : filters.status.split(",").filter(Boolean)
      : []
  );

  const { table } = usePaginatedTable();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      name: value,
    }));
    table.setGlobalFilter(value);
    table.setPageIndex(0); // Reset to first page on search change
  };

  return (
    <Collapsible>
      <div className="users-table-head flex flex-wrap items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <div className="actions flex flex-wrap items-center gap-2">
          <Field preIcon={<SearchIcon />}>
            <Input
              variant="field"
              placeholder={commonT("placeholder")}
              value={filters.name}
              onChange={handleSearchChange}
              type="search"
            />
          </Field>
          <CollapsibleTrigger asChild>
            <Toggle pressed={true} className="rounded-full">
              <FilterAltIcon />
            </Toggle>
          </CollapsibleTrigger>
          {Organization?.hasTenant && (
            <Link href="/users/create">
              <Button>{t("actions.create")}</Button>
            </Link>
          )}
        </div>
      </div>
      <CollapsibleContent>
        <FilterBar
          onClear={() => {
            setStatus([]);
            setFilters((prev) => ({
              ...prev,
              status: [],
              name: "",
            }));
            table.resetColumnFilters();
            table.setGlobalFilter("");
            table.setPageIndex(0); // Reset to first page on filter change
          }}
        >
          <FilterBox
            triggerLabel={t("filters.status")}
            label={t("filters.selectFromList")}
            onReset={() => {
              setStatus([]);
              setFilters((prev) => ({
                ...prev,
                status: [],
              }));
              table.resetColumnFilters();
            }}
            onApply={() => {
              setFilters((prev) => ({
                ...prev,
                status: status.join(","),
              }));
              table.setColumnFilters((prev) => [
                ...prev.filter((col) => col.id !== "status"),
                { id: "status", value: status.join(",") },
              ]);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            numberOfFilters={status.length}
          >
            <RadioGroup
              defaultValue=""
              onValueChange={(value: string) => {
                if (value === "") {
                  setStatus([]);
                } else {
                  setStatus(value.split(","));
                }
              }}
              value={status.length === 1 ? status[0] : ""}
            >
              {userStatuses.map((s) => (
                <div className="flex items-center space-x-2" key={s.value}>
                  <RadioGroupItem value={s.value} id={s.value} />
                  <Label htmlFor={s.value}>{t(`status.${s.value}`)}</Label>
                </div>
              ))}
            </RadioGroup>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default UsersTableHeader;
