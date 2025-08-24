import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { AgentStatsFilters } from "./agent-stats";

type AgentStatsToolbarProps = {
  filters: AgentStatsFilters;
  setFilters: (filters: AgentStatsFilters) => void;
};
const AgentStatsToolbar = ({ filters, setFilters }: AgentStatsToolbarProps) => {
  const { table } = usePaginatedTable();

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
          placeholder="Search..."
          value={filters.search}
          onChange={onSearchChange}
          variant="field"
        />
      </Field>
    </div>
  );
};

export default AgentStatsToolbar;
