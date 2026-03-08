"use client";

import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import { columns } from "./columns";
import { useTranslations } from "@/providers/TranslationProvider";
import WebrtcTableHead from "./head";
import webrtcCredentialService from "@/services/webrtc-credential.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

const WebrtcCredentialsTable = () => {
  const t = useTranslations();
  const { data: credentials = [], isLoading } = useLocalizedQuery({
    queryKey: ["webrtc-credentials"],
    queryFn: webrtcCredentialService.getAll,
  });

  return (
    <div className="border rounded-lg">
      <PaginatedTable
        data={credentials}
        columns={columns(t)}
        manualPagination={false}
      >
        <WebrtcTableHead />
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

export default WebrtcCredentialsTable;
