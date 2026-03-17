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
import ZendeskTableHead from "./head";
import zendeskCredentialService from "@/services/zendesk-credential.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

const ZendeskCredentialsTable = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { data: credentials = [], isLoading } = useLocalizedQuery({
    queryKey: ["zendesk-credentials"],
    queryFn: zendeskCredentialService.getAll,
  });

  const memoizedColumns = useMemo(() => columns(t), [locale]);

  return (
    <div className="border rounded-lg">
      <PaginatedTable
        data={credentials}
        columns={memoizedColumns}
        manualPagination={false}
      >
        <ZendeskTableHead />
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

export default ZendeskCredentialsTable;
