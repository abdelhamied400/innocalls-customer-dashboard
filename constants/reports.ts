import { ReportType } from "@/types/api/report";

// Report categories for conditional field rendering
export const OUTBOUND_REPORTS: ReportType[] = [
  "outbound_summary",
  "outbound_agent_stats",
  "outbound_date_distribution",
  "outbound_hourly_distribution",
];

export const INBOUND_AGENT_REPORTS: ReportType[] = [
  "inbound_agent_summary",
  "inbound_agent_date_distribution",
  "inbound_agent_hourly_distribution",
];

export const INBOUND_QUEUE_REPORTS: ReportType[] = [
  "inbound_queue_summary",
  "inbound_queue_date_distribution",
  "inbound_queue_hourly_distribution",
  "inbound_queue_agent_performance",
  "inbound_queue_repeated_callers",
];

export const UNANSWERED_REPORTS: ReportType[] = [
  "unanswered_summary",
  "inbound_unanswered_date_distribution",
  "inbound_unanswered_hourly_distribution",
  "outbound_unanswered_date_distribution",
  "outbound_unanswered_hourly_distribution",
];

export const AGENT_REPORTS: ReportType[] = [
  "agent_summary",
  "agent_call_distribution",
  "agent_sla_compliance",
];

// Report type options for select dropdown
export const REPORT_OPTIONS = [
  // Outbound Reports
  { label: "Outbound Summary", value: "outbound_summary" },
  { label: "Outbound Agent Stats", value: "outbound_agent_stats" },
  { label: "Outbound Date Distribution", value: "outbound_date_distribution" },
  { label: "Outbound Hourly Distribution", value: "outbound_hourly_distribution" },
  // Inbound Agent Reports
  { label: "Inbound Agent Summary", value: "inbound_agent_summary" },
  { label: "Inbound Agent Date Distribution", value: "inbound_agent_date_distribution" },
  { label: "Inbound Agent Hourly Distribution", value: "inbound_agent_hourly_distribution" },
  // Inbound Queue Reports
  { label: "Inbound Queue Summary", value: "inbound_queue_summary" },
  { label: "Inbound Queue Date Distribution", value: "inbound_queue_date_distribution" },
  { label: "Inbound Queue Hourly Distribution", value: "inbound_queue_hourly_distribution" },
  { label: "Inbound Queue Agent Performance", value: "inbound_queue_agent_performance" },
  { label: "Inbound Queue Repeated Callers", value: "inbound_queue_repeated_callers" },
  // Unanswered Reports
  { label: "Unanswered Summary", value: "unanswered_summary" },
  { label: "Inbound Unanswered Date Distribution", value: "inbound_unanswered_date_distribution" },
  { label: "Inbound Unanswered Hourly Distribution", value: "inbound_unanswered_hourly_distribution" },
  { label: "Outbound Unanswered Date Distribution", value: "outbound_unanswered_date_distribution" },
  { label: "Outbound Unanswered Hourly Distribution", value: "outbound_unanswered_hourly_distribution" },
  // Agent Reports
  { label: "Agent Summary", value: "agent_summary" },
  { label: "Agent Call Distribution", value: "agent_call_distribution" },
  { label: "Agent SLA Compliance", value: "agent_sla_compliance" },
] as const;

// Helper functions to determine which fields to show
export const shouldShowIncludeInternalCalls = (reportType: ReportType | undefined): boolean => {
  if (!reportType) return false;
  return (
    OUTBOUND_REPORTS.includes(reportType) ||
    INBOUND_AGENT_REPORTS.includes(reportType) ||
    UNANSWERED_REPORTS.includes(reportType) ||
    reportType === "agent_call_distribution"
  );
};

export const shouldShowExtensions = (reportType: ReportType | undefined): boolean => {
  if (!reportType) return false;
  return (
    OUTBOUND_REPORTS.includes(reportType) ||
    INBOUND_AGENT_REPORTS.includes(reportType) ||
    UNANSWERED_REPORTS.includes(reportType) ||
    reportType === "agent_summary"
  );
};

export const shouldShowQueue = (reportType: ReportType | undefined): boolean => {
  if (!reportType) return false;
  return INBOUND_QUEUE_REPORTS.includes(reportType);
};

export const shouldShowSla = (reportType: ReportType | undefined): boolean => {
  if (!reportType) return false;
  return reportType === "agent_sla_compliance" || reportType === "agent_summary";
};
