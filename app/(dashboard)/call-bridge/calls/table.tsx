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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle2,
  XCircle,
  Phone,
  User,
  Clock,
  PhoneOutgoing,
  RotateCw,
  Copy,
  Check,
  FileText,
} from "lucide-react";

const parseDurationToMinutes = (duration: string): number => {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) return parts[0] + parts[1] / 60;
  return Number(duration) || 0;
};

const CopyButton = ({
  value,
  successMessage,
}: {
  value: string;
  successMessage: string;
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success(successMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center h-5 w-5 rounded hover:bg-neutral-100 text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? (
        <Check className="h-3 w-3 text-success-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );
};

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

                const talkMinutes = call.callOutcome?.talkTime
                  ? parseDurationToMinutes(call.callOutcome.talkTime)
                  : 0;
                const scheduledMinutes = call.scheduleDuration
                  ? parseDurationToMinutes(call.scheduleDuration)
                  : 0;
                const durationPercent =
                  scheduledMinutes > 0
                    ? Math.min(
                        Math.round((talkMinutes / scheduledMinutes) * 100),
                        100,
                      )
                    : 0;

                return (
                  <TooltipProvider>
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
                                endCallVariantMap[call.endCallStatus] ||
                                "neutral"
                              }
                            >
                              {call.endCallStatus || "-"}
                            </Badge>
                          </div>

                          {scheduledMinutes > 0 && durationPercent > 0 ? (
                            <div className="flex-1 max-w-md flex flex-col gap-1.5">
                              <span className="text-xs text-muted-foreground uppercase tracking-wide text-center">
                                {t("details.durationUsage")}
                              </span>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="uppercase tracking-wide">
                                  {t("details.talkTime")}
                                </span>
                                <span className="uppercase tracking-wide">
                                  {t("details.scheduleDuration")}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold whitespace-nowrap">
                                  {call.callOutcome?.talkTime || "-"}
                                </span>
                                <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      "h-full rounded-full transition-all",
                                      durationPercent <= 50
                                        ? "bg-success-500"
                                        : durationPercent <= 80
                                          ? "bg-warning-400"
                                          : "bg-destructive",
                                    )}
                                    style={{ width: `${durationPercent}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold whitespace-nowrap">
                                  {call.scheduleDuration || "-"}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground text-center">
                                {durationPercent}%
                              </span>
                            </div>
                          ) : (
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
                          )}
                        </div>

                        {summary && (
                          <div className="flex gap-2 border-t pt-3">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                {t("details.summary")}
                              </span>
                              <p className="text-sm leading-relaxed">
                                {summary}
                              </p>
                            </div>
                          </div>
                        )}
                        {!summary && (
                          <div className="flex flex-col gap-1 border-t pt-3">
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">
                              {t("details.summary")}
                            </span>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              -
                            </p>
                          </div>
                        )}
                      </div>

                      {call.status !== "deleted" && (
                        <>
                          {call.endCallStatus === "Completed" &&
                            recordingUrl && (
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
                                index: 1,
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
                                index: 2,
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
                                    <div className="flex items-center gap-2.5">
                                      <div
                                        className={cn(
                                          "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0",
                                          r.index === 1
                                            ? "bg-primary-500"
                                            : "bg-blue-500",
                                        )}
                                      >
                                        {r.index}
                                      </div>
                                      <h4 className="font-semibold text-sm">
                                        {r.label}
                                      </h4>
                                    </div>
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
                                      {r.recipient?.phone && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span>
                                              <CopyButton
                                                value={r.recipient.phone}
                                                successMessage={t(
                                                  "details.copied",
                                                )}
                                              />
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            {t("details.phone")}
                                          </TooltipContent>
                                        </Tooltip>
                                      )}
                                    </div>
                                  </div>

                                  {(r.callerNumber || r.lastAttemptTime) && (
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
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span>
                                              <CopyButton
                                                value={r.callerNumber}
                                                successMessage={t(
                                                  "details.copied",
                                                )}
                                              />
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            {t("details.callerNumber")}
                                          </TooltipContent>
                                        </Tooltip>
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
                                  )}

                                  {r.trials != null && r.trials > 0 && (
                                    <div className="border-t pt-3 flex items-center gap-2">
                                      <RotateCw className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                      <span className="text-sm text-muted-foreground">
                                        {t("details.trials")}:
                                      </span>
                                      <div className="flex items-center gap-1.5">
                                        {Array.from({
                                          length: r.trials,
                                        }).map((_, i) => (
                                          <div
                                            key={i}
                                            className={cn(
                                              "h-2 w-2 rounded-full",
                                              isAnswered
                                                ? "bg-success-500"
                                                : "bg-destructive",
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
                  </TooltipProvider>
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
