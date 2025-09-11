import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { useTranslations } from "@/providers/TranslationProvider";
import { AgentsPerformanceFilters } from "./table";

type AgentsPerformanceHeadProps = {
  filters: AgentsPerformanceFilters;
  setFilters: React.Dispatch<React.SetStateAction<AgentsPerformanceFilters>>;
};
const AgentsPerformanceHead = ({
  filters,
  setFilters,
}: AgentsPerformanceHeadProps) => {
  const t = useTranslations("users.agentsPerformance");
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
      <div className="actions flex flex-wrap items-center gap-2"></div>
    </div>
  );
};

export default AgentsPerformanceHead;
