"use client";
import withPermission from "@/containers/withPermission";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Download, Search } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerService from "@/services/auto-dialer.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { UncompletedRequest } from "@/types/autoDialerCampaign";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";

const columns = (t: any): ColumnDef<UncompletedRequest>[] => [
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

const UncompletedRequestsPage = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("autoDialer.uncompletedRequests");
  const searchT = useTranslations("common.search");
  const [isExporting, setIsExporting] = useState(false);
  const [search, setSearch] = useState("");

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

  if (isError) {
    if (isAxiosError(error)) {
      toast.error(t("toasts.errorTitle"), {
        description:
          error.response?.data?.message || t("toasts.errorDescription"),
      });
    } else {
      toast.error(t("toasts.errorTitle"), {
        description: t("toasts.errorDescription"),
      });
    }
  }

  const filteredRequests = useMemo(() => {
    const rows = data?.requests ?? [];
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;
    return rows.filter((row) => {
      const searchable = [row.phone, row.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(keyword);
    });
  }, [data?.requests, search]);

  const onExport = async () => {
    try {
      setIsExporting(true);
      await autoDialerService.exportUncompletedRequests(id);
      toast.success(t("exportSuccess"), {
        description: t("exportSuccessDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("exportError"), {
          description:
            error.response?.data?.message || t("exportErrorDescription"),
        });
        return;
      }
      toast.error(t("exportError"), {
        description: t("exportErrorDescription"),
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <div className="table-head">
        <div className="flex justify-between items-center gap-4 p-3">
          <h3>{t("title")}</h3>
          <div className="flex items-center gap-4 actions">
            <Field preIcon={<Search className="text-muted-foreground" />}>
              <Input
                variant="field"
                placeholder={searchT("placeholder")}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onExport}
                    disabled={isExporting}
                  >
                    <Download />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("export")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <PaginatedTable
        data={filteredRequests}
        columns={columns(t)}
        pagination={{
          totalItems: data?.totalItems ?? 0,
          totalPages: data?.totalPages ?? 0,
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

export default withPermission(
  UncompletedRequestsPage,
  "fullAccessAutoDialerCampaigns",
);
