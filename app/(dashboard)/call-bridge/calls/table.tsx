"use client";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import callBridgeService from "@/services/call-bridge.service";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import { useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import { columns, CallBridgeCallsCols } from "./columns";
import CallBridgeCallsHead from "./head";
import { Badge, BadgeVariant } from "@/components/ui/badge";
import StreamingSoundPlayer from "@/components/StreamingSoundPlayer";
import { cn } from "@/lib/utils";

const CallBridgeCallsTable = () => {
  const t = useTranslations("callBridge.calls");
  const locale = useLocale();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const endCallVariantMap: Record<string, BadgeVariant> = {
    Completed: "success",
    Deleted: "neutral",
    "Call Failed": "destructive",
  };

  const endCallBorderMap: Record<string, string> = {
    Completed: "border-l-success-500 border-success-200 bg-success-50/40",
    Deleted: "border-l-neutral-400 border-neutral-200 bg-neutral-50",
    "Call Failed":
      "border-l-destructive border-destructive-200 bg-destructive-50/40",
  };

  const { data, isLoading, isError, error } = useLocalizedQuery<{
    calls: CallBridgeCallsCols[];
    totalItems: number;
    totalPages: number;
  }>({
    queryKey: ["call-bridge-calls-list", pagination],
    queryFn: async () =>
      await callBridgeService.fetchCalls({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
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
  }, [isError, error, t]);

  return (
    <div className="rounded-lg flex-1 flex flex-col overflow-hidden">
      <PaginatedTable
        data={data?.calls || []}
        columns={columns(t)}
        pagination={{
          totalItems: data?.totalItems || 0,
          totalPages: data?.totalPages || 0,
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
        getRowCanExpand={() => true}
      >
        <CallBridgeCallsHead />
        <PaginatedTableContent>
          <PaginatedTableHead />
          {isLoading && <PaginatedTableSkeleton />}
          {!isLoading && (
            <PaginatedTableBody
              renderDetails={(row) => {
                const call = row.original as CallBridgeCallsCols;
                const summary =
                  locale === "ar"
                    ? call.callOutcome?.summary?.ar
                    : call.callOutcome?.summary?.en;
                const recordingUrl = call.uniqueIdentifier
                  ? `https://verecordings.innocalls.com/recordings/recording-${call.uniqueIdentifier}.wav`
                  : undefined;

                return (
                  <div className="rounded-lg border p-4 bg-neutral-50 flex flex-col gap-4">
                    <div
                      className={cn(
                        "rounded-xl border border-l-4 bg-white p-4 shadow-sm flex flex-col gap-4",
                        endCallBorderMap[call.endCallStatus] ||
                          "border-l-neutral-400 border-neutral-200 bg-white",
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">
                            {t("details.endCallStatus")}
                          </span>
                          <Badge
                            variant={
                              endCallVariantMap[call.endCallStatus] || "neutral"
                            }
                          >
                            {call.endCallStatus || "-"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">
                              {t("details.talkTime")}
                            </span>
                            <span className="text-sm font-semibold" dir="ltr">
                              {call.callOutcome?.talkTime || "-"}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">
                              {t("details.scheduleDuration")}
                            </span>
                            <span className="text-sm font-semibold" dir="ltr">
                              {call.scheduleDuration || "-"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 border-t pt-3">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          {t("details.summary")}
                        </span>
                        <p className="text-sm leading-relaxed">
                          {summary || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col gap-3">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {t("details.recording")}
                      </span>
                      {recordingUrl ? (
                        <StreamingSoundPlayer
                          url={recordingUrl}
                          label={`recording-${call.uniqueIdentifier || call.id}.wav`}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">-</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border bg-white p-3 flex flex-col gap-2">
                        <h4 className="font-semibold text-sm">
                          {t("details.firstRecipient")}
                        </h4>
                        <p className="text-sm">
                          {t("details.name")}:{" "}
                          {call.firstRecipient?.name || "-"}
                        </p>
                        <p className="text-sm font-bold" dir="ltr">
                          {t("details.phone")}:{" "}
                          {call.firstRecipient?.phone || "-"}
                        </p>
                        <p className="text-sm">
                          {t("details.lastStatus")}:{" "}
                          {call.callOutcome?.firstRecipientLastCallStatus ||
                            "-"}
                        </p>
                        <p className="text-sm">
                          {t("details.trials")}:{" "}
                          {call.callOutcome?.firstRecipientTrials ?? "-"}
                        </p>
                      </div>

                      <div className="rounded-lg border bg-white p-3 flex flex-col gap-2">
                        <h4 className="font-semibold text-sm">
                          {t("details.secondRecipient")}
                        </h4>
                        <p className="text-sm">
                          {t("details.name")}:{" "}
                          {call.secondRecipient?.name || "-"}
                        </p>
                        <p className="text-sm font-bold" dir="ltr">
                          {t("details.phone")}:{" "}
                          {call.secondRecipient?.phone || "-"}
                        </p>
                        <p className="text-sm">
                          {t("details.lastStatus")}:{" "}
                          {call.callOutcome?.secondRecipientLastCallStatus ||
                            "-"}
                        </p>
                        <p className="text-sm">
                          {t("details.trials")}:{" "}
                          {call.callOutcome?.secondRecipientTrials ?? "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          )}
        </PaginatedTableContent>
        {!isLoading && <PaginatedTablePagination />}
      </PaginatedTable>
    </div>
  );
};

export default CallBridgeCallsTable;
