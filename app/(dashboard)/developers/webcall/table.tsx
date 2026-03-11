"use client";

import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import { columns } from "./columns";
import { useTranslations } from "@/providers/TranslationProvider";
import WebCallTableHead from "./head";
import webcallService from "@/services/webcall.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

const WebCallTable = () => {
  const t = useTranslations();
  const { data: apps = [], isLoading } = useLocalizedQuery({
    queryKey: ["webcall-apps"],
    queryFn: webcallService.getAll,
  });

  return (
    <div className="border rounded-lg">
      <PaginatedTable
        data={apps}
        columns={columns(t)}
        manualPagination={false}
      >
        <WebCallTableHead />
        <PaginatedTableContent>
          <PaginatedTableHead />
          {isLoading && <PaginatedTableSkeleton />}
          {!isLoading && <PaginatedTableBody />}
        </PaginatedTableContent>
        {!isLoading && <PaginatedTablePagination />}
      </PaginatedTable>
    </div>
  );
};

export default WebCallTable;
