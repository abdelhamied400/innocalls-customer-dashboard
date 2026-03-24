"use client";

import { useParams } from "next/navigation";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import ticketsService, { TicketDetail, TicketReply } from "@/services/tickets.service";
import { useTranslations } from "@/providers/TranslationProvider";
import withActiveOrganization from "@/containers/withActiveOrganization";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, Headset, Mail, Globe, Phone, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Open":
      return "success";
    case "Closed":
      return "muted";
    case "On Hold":
      return "warning";
    case "Escalated":
      return "destructive";
    default:
      return "secondary";
  }
};

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case "High":
      return "destructive";
    case "Medium":
      return "warning";
    case "Low":
      return "success";
    default:
      return "secondary";
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel?.toUpperCase()) {
    case "EMAIL":
      return <Mail className="h-3 w-3" />;
    case "WEB":
      return <Globe className="h-3 w-3" />;
    case "PHONE":
      return <Phone className="h-3 w-3" />;
    default:
      return null;
  }
};

const TicketViewPage = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const t = useTranslations("innoSupport.view");
  const [replySortOrder, setReplySortOrder] = useState<"asc" | "desc">("desc");

  const { data: ticket, isLoading } = useLocalizedQuery<TicketDetail>({
    queryKey: ["ticket", ticketId],
    queryFn: () => ticketsService.getTicketById(ticketId),
    enabled: !!ticketId,
  });

  if (isLoading) {
    return <TicketViewSkeleton />;
  }

  if (!ticket) {
    return null;
  }

  const isValidReply = (reply: TicketReply) => {
    if (!reply.summary) return false;
    const trimmed = reply.summary.trim();
    if (!trimmed || trimmed === "{}" || trimmed === "null" || trimmed === "undefined") return false;
    return true;
  };

  const sortedReplies = [...(ticket.replies || [])]
    .filter(isValidReply)
    .sort((a, b) => {
      const diff = new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime();
      return replySortOrder === "asc" ? diff : -diff;
    });

  return (
    <div className="page h-full flex flex-col gap-4 p-4 overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/innosupport">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            {t("backToList")}
          </Button>
        </Link>
      </div>

      {/* Ticket Info Card */}
      <div className="border rounded-xl p-6 bg-white">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">{ticket.subject}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t("ticketNumber")}: #{ticket.ticketNumber}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(ticket.status)}>
              {ticket.status}
            </Badge>
            {ticket.priority && ticket.priority !== "null" && ticket.priority !== "undefined" && (
              <Badge variant={getPriorityVariant(ticket.priority)}>
                {t(`priority_values.${ticket.priority}`)}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem label={t("department")} value={ticket.department} />
          <InfoItem label={t("classification")} value={ticket.classification} />
          <InfoItem label={t("channel")} value={ticket.channel} />
          <InfoItem label={t("assignee")} value={ticket.assignee} />
          <InfoItem
            label={t("createdAt")}
            value={
              ticket.createdTime
                ? format(new Date(ticket.createdTime), "dd MMM yyyy, HH:mm")
                : "-"
            }
          />
          <InfoItem
            label={t("dueDate")}
            value={
              ticket.dueDate
                ? format(new Date(ticket.dueDate), "dd MMM yyyy, HH:mm")
                : "-"
            }
          />
        </div>

        {ticket.description && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("description")}
            </h3>
            <p className="text-sm">{ticket.description}</p>
          </div>
        )}
      </div>

      {/* Replies - Chat Style */}
      <div className="border rounded-xl bg-white flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">
            {t("replies")} ({sortedReplies.length})
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setReplySortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            <ArrowUpDown className="h-4 w-4" />
            {t(replySortOrder === "asc" ? "oldestFirst" : "newestFirst")}
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {sortedReplies.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t("noReplies")}
            </p>
          ) : (
            sortedReplies.map((reply, index) => (
              <ReplyBubble key={index} reply={reply} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const sanitizeValue = (value: string) => {
  if (!value || value.includes("undefined") || value.includes("null")) return "-";
  return value;
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{sanitizeValue(value)}</span>
  </div>
);

const ReplyBubble = ({ reply }: { reply: TicketReply }) => {
  const isAgent = reply.direction === "out";

  return (
    <div
      className={cn("flex gap-3 max-w-[85%]", isAgent ? "ms-auto" : "me-auto")}
    >
      {!isAgent && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
      )}

      <div className={cn("flex flex-col gap-1", isAgent ? "items-end" : "items-start")}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{reply.authorName}</span>
          {getChannelIcon(reply.channel)}
        </div>

        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm",
            isAgent
              ? "bg-primary-100 text-primary-800 rounded-tr-sm"
              : "bg-gray-100 text-gray-800 rounded-tl-sm"
          )}
        >
          <p className="whitespace-pre-wrap">{reply.summary}</p>
        </div>

        {reply.createdTime && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {format(new Date(reply.createdTime), "dd MMM yyyy, HH:mm")}
          </div>
        )}
      </div>

      {isAgent && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success-100 text-success-500 flex items-center justify-center">
          <Headset className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

const TicketViewSkeleton = () => (
  <div className="page h-full flex flex-col gap-4 p-4">
    <Skeleton className="h-10 w-40" />
    <div className="border rounded-xl p-6">
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
    <div className="border rounded-xl p-4 flex-1">
      <Skeleton className="h-6 w-32 mb-4" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-3/4 mb-4" />
      ))}
    </div>
  </div>
);

export default withActiveOrganization(TicketViewPage);
