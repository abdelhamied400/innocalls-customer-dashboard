"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import callSurveyService from "@/services/call-survey.service";
import { useTranslations } from "@/providers/TranslationProvider";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { PaginationState } from "@tanstack/react-table";
import UncompletedHead from "./head";

const columns = (t: any) => [
  {
    accessorKey: "phone",
    header: t("columns.phone"),
  },
  {
    accessorKey: "name",
    header: t("columns.name"),
  },
  {
    accessorKey: "remainingTrials",
    header: t("columns.remainingTrials"),
  },
];

const UncompletedTable = () => {
  const t = useTranslations("callSurvey.uncompleted");
  const { id } = useParams<{ id: string }>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: survey } = useLocalizedQuery({
    queryKey: ["call-survey-detail", id],
    queryFn: () => callSurveyService.getSurvey(id),
    enabled: !!id,
  });

  const { data, isLoading, isError, error } = useLocalizedQuery({
    queryKey: ["call-survey-uncompleted", id, pagination],
    queryFn: () =>
      callSurveyService.fetchUncompletedRequests(
        id,
        pagination.pageIndex + 1,
        pagination.pageSize,
      ),
    enabled: !!id,
    gcTime: 0,
  });

  useEffect(() => {
    if (isError) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description:
            error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.error"), {
        description: t("toasts.errorDescription"),
      });
    }
  }, [isError, error]);

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
        <UncompletedHead
          surveyId={id}
          surveyName={survey?.name}
          totalItems={data?.totalItems || 0}
        />
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

export default UncompletedTable;
