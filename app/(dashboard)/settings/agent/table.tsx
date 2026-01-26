"use client";

import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import { columns } from "./columns";
import { useTranslations } from "@/providers/TranslationProvider";
import BreakTypesTableHead from "./head";
import { useQuery } from "@tanstack/react-query";
import breakTypesService from "@/services/break-types.service";

const BreakTypesTable = () => {
  const t = useTranslations();
  const { data: breakTypes = [], isLoading } = useQuery({
    queryKey: ["break-types"],
    queryFn: breakTypesService.getAllBreakTypes,
  });

  return (
    <PaginatedTable data={breakTypes} columns={columns(t)} manualPagination={false}>
      <BreakTypesTableHead />
      <PaginatedTableContent>
        <PaginatedTableHead />
        {isLoading && <PaginatedTableSkeleton />}
        {!isLoading && <PaginatedTableBody />}
      </PaginatedTableContent>
      {!isLoading && <PaginatedTablePagination />}
    </PaginatedTable>
  );
};

export default BreakTypesTable;
