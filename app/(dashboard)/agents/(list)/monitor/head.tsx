import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Search } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";

type MonitorUsersHeadProps = {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};
const MonitorUsersHead = ({ filters, setFilters }: MonitorUsersHeadProps) => {
  const t = useTranslations("users.monitor");
  const searchT = useTranslations("common.search");
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
    <div className="users-table-head flex flex-wrap items-center justify-between p-4">
      <h2>{t("title")}</h2>
      <div className="actions flex flex-wrap items-center gap-2">
        <Field preIcon={<Search />}>
          <Input
            variant="field"
            placeholder={searchT("placeholder")}
            value={filters.name || ""}
            onChange={handleSearchChange}
            type="search"
          />
        </Field>
      </div>
    </div>
  );
};

export default MonitorUsersHead;
