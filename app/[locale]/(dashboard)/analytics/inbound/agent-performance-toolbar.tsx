import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { AgentPerformanceFilters } from "./agent-performance";
import { useTranslations } from "next-intl";

type AgentPerformanceToolbarProps = {
  filters: AgentPerformanceFilters;
  setFilters: (filters: AgentPerformanceFilters) => void;
};

const AgentPerformanceToolbar = ({
  filters,
  setFilters,
}: AgentPerformanceToolbarProps) => {
  const { table } = usePaginatedTable();
  const t = useTranslations("common.search");

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({ ...filters, search: value });
    // filter table data
    table.setGlobalFilter(value);
  };

  return (
    <div className="flex items-center gap-2 p-2 mb-2 bg-gray-100 rounded-lg">
      <Field>
        <Input
          placeholder={t("placeholder")}
          value={filters.search}
          onChange={onSearchChange}
          variant="field"
        />
      </Field>
    </div>
  );
};

export default AgentPerformanceToolbar;
