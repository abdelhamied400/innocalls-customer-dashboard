"use client";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerService from "@/services/auto-dialer.service";
import { PaginationState } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTable from "@/components/Table/PaginatedTable";
import { columns } from "./columns";

const UncompletedRequestsTable = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("autoDialer.uncompletedRequests");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error } = useLocalizedQuery({
    queryKey: ["auto-dialer-uncompleted-requests", id, pagination],
    queryFn: async () =>
      await autoDialerService.fetchUncompletedRequests(id, {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  });

  console.log(data);

  useEffect(() => {
    if (isError) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.errorTitle"), {
          description:
            error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.errorTitle"), {
        description: t("toasts.errorDescription"),
      });
    }
  }, [isError, error, t]);

  return (
    <div className="rounded-lg flex-1 flex flex-col overflow-hidden">
      <PaginatedTable
        data={data?.requests || []}
        columns={columns(t)}
        pagination={{
          totalItems: data?.totalItems || 0,
          totalPages: data?.totalPages || 0,
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
      >
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

export default UncompletedRequestsTable;
