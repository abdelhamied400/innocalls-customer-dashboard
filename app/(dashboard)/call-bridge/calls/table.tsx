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
import { PaginationState, SortingState } from "@tanstack/react-table";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import { columns, CallBridgeCallsCols } from "./columns";
import CallBridgeCallsHead from "./head";
import { Badge, BadgeVariant } from "@/components/ui/badge";
import StreamingSoundPlayer from "@/components/StreamingSoundPlayer";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Phone,
  User,
  Clock,
  PhoneOutgoing,
  RotateCw,
} from "lucide-react";

const CallBridgeCallsTable = () => {
  const t = useTranslations("callBridge.calls");
  const locale = useLocale();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const handleSetFilters: React.Dispatch<
    React.SetStateAction<Record<string, any>>
  > = (value) => {
    setFilters(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortingChange: React.Dispatch<
    React.SetStateAction<SortingState>
  > = (value) => {
    setSorting(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const sortParams =
    sorting.length > 0 &&
    ["scheduleDateTime", "scheduleDuration"].includes(sorting[0].id)
      ? {
          sortBy: sorting[0].id,
          sortOrder: sorting[0].desc ? "desc" : "asc",
        }
      : {};

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
    queryKey: ["call-bridge-calls-list", filters, pagination, sorting],
    queryFn: async () =>
      await callBridgeService.fetchCalls({
        ...filters,
        ...sortParams,
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
        onSortingChange={handleSortingChange}
        getRowCanExpand={() => true}
      >
        <CallBridgeCallsHead filters={filters} setFilters={handleSetFilters} />
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
                            <span className="text-sm font-semibold">
                              {call.callOutcome?.talkTime || "-"}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">
                              {t("details.scheduleDuration")}
                            </span>
                            <span className="text-sm font-semibold">
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

                    {call.status !== "deleted" && (
                      <>
                        {call.endCallStatus === "Completed" && recordingUrl && (
                          <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col gap-3">
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">
                              {t("details.recording")}
                            </span>
                            <StreamingSoundPlayer
                              url={recordingUrl}
                              label={`recording-${call.uniqueIdentifier || call.id}.wav`}
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            {
                              label: t("details.firstRecipient"),
                              recipient: call.firstRecipient,
                              lastStatus:
                                call.callOutcome
                                  ?.firstRecipientLastCallStatus,
                              trials:
                                call.callOutcome?.firstRecipientTrials,
                              lastAttemptTime:
                                call.callOutcome
                                  ?.firstRecipientLastAttemptTime,
                              callerNumber:
                                call.callOutcome?.firstCallerNumber,
                            },
                            {
                              label: t("details.secondRecipient"),
                              recipient: call.secondRecipient,
                              lastStatus:
                                call.callOutcome
                                  ?.secondRecipientLastCallStatus,
                              trials:
                                call.callOutcome?.secondRecipientTrials,
                              lastAttemptTime:
                                call.callOutcome
                                  ?.secondRecipientLastAttemptTime,
                              callerNumber:
                                call.callOutcome?.secondCallerNumber,
                            },
                          ].map((r) => {
                            const isAnswered =
                              r.lastStatus === "Answered";

                            return (
                              <div
                                key={r.label}
                                className="rounded-xl border bg-white p-4 shadow-sm flex flex-col gap-3"
                              >
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-sm">
                                    {r.label}
                                  </h4>
                                  {r.lastStatus && (
                                    <Badge
                                      variant={
                                        isAnswered
                                          ? "success"
                                          : "destructive"
                                      }
                                      className="gap-1 text-xs"
                                    >
                                      {isAnswered ? (
                                        <CheckCircle2 className="h-3 w-3" />
                                      ) : (
                                        <XCircle className="h-3 w-3" />
                                      )}
                                      {r.lastStatus}
                                    </Badge>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex items-center gap-2 text-sm">
                                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">
                                      {t("details.name")}:
                                    </span>
                                    <span className="font-medium truncate">
                                      {r.recipient?.name || "-"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">
                                      {t("details.phone")}:
                                    </span>
                                    <span className="font-semibold" dir="ltr">
                                      {r.recipient?.phone || "-"}
                                    </span>
                                  </div>
                                </div>

                                <div className="border-t pt-3 grid grid-cols-2 gap-3">
                                  {r.callerNumber && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <PhoneOutgoing className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                      <span className="text-muted-foreground">
                                        {t("details.callerNumber")}:
                                      </span>
                                      <span className="font-medium" dir="ltr">
                                        {r.callerNumber}
                                      </span>
                                    </div>
                                  )}
                                  {r.lastAttemptTime && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                      <span className="text-muted-foreground">
                                        {t("details.lastAttemptTime")}:
                                      </span>
                                      <span className="font-medium">
                                        {new Date(
                                          r.lastAttemptTime,
                                        ).toLocaleTimeString(locale, {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          second: "2-digit",
                                          hour12: true,
                                        })}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {r.trials != null && (
                                  <div className="border-t pt-3 flex items-center gap-2">
                                    <RotateCw className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <span className="text-sm text-muted-foreground">
                                      {t("details.trials")}:
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      {Array.from({
                                        length: Math.max(
                                          r.trials ?? 1,
                                          1,
                                        ),
                                      }).map((_, i) => (
                                        <div
                                          key={i}
                                          className={cn(
                                            "h-2 w-2 rounded-full",
                                            i < (r.trials ?? 0)
                                              ? isAnswered
                                                ? "bg-success-500"
                                                : "bg-destructive"
                                              : "bg-neutral-200",
                                          )}
                                        />
                                      ))}
                                      <span className="text-xs font-medium ms-1">
                                        {r.trials}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
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
