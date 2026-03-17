"use client";

import { useMemo } from "react";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import { columns } from "./columns";
import { useTranslations, useLocale } from "@/providers/TranslationProvider";
import FreshdeskTableHead from "./head";
import freshdeskCredentialService from "@/services/freshdesk-credential.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

const FreshdeskCredentialsTable = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { data: credentials = [], isLoading } = useLocalizedQuery({
    queryKey: ["freshdesk-credentials"],
    queryFn: freshdeskCredentialService.getAll,
  });

  const memoizedColumns = useMemo(() => columns(t), [locale]);

  return (
    <div className="border rounded-lg">
      <PaginatedTable
        data={credentials}
        columns={memoizedColumns}
        manualPagination={false}
      >
        <FreshdeskTableHead />
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

export default FreshdeskCredentialsTable;
