"use client";

import { PaginationState, SortingState } from "@tanstack/react-table";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import numbersService from "@/services/numbers.service";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import NumbersTableHead from "./head";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";

const DataTable = () => {
  const { setPageTitle } = useAppStore();

  const t = useTranslations("numbers");
  const locale = useLocale();

  useEffect(() => {
    setPageTitle(t("title"));

    // Cleanup when component unmounts
    return () => setPageTitle(null);
  }, [locale]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // client-side data fetching
  const { data = [], isLoading } = useLocalizedQuery({
    queryKey: ["numbers"],
    queryFn: numbersService.fetchNumbers,
  });

  return (
    <div className="h-auto sm:h-full flex flex-col border rounded-xl">
      <PaginatedTable
        data={data}
        columns={columns()}
        manualPagination={false}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      >
        <NumbersTableHead />

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

export default DataTable;
