import { ReportType } from "@/types/api/report";

// Unanswered Queue Calls Reports
export const UNANSWERED_QUEUE_CALLS_REPORTS: ReportType[] = [
  "unanswered_queue_calls",
];

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

// Report type values for select dropdown
export const REPORT_TYPE_VALUES: ReportType[] = [
  // Unanswered Queue Calls
  "unanswered_queue_calls",
  // Outbound Reports
  "outbound_summary",
  "outbound_agent_stats",
  "outbound_date_distribution",
  "outbound_hourly_distribution",
  // Inbound Agent Reports
  "inbound_agent_summary",
  "inbound_agent_date_distribution",
  "inbound_agent_hourly_distribution",
  // Inbound Queue Reports
  "inbound_queue_summary",
  "inbound_queue_date_distribution",
  "inbound_queue_hourly_distribution",
  "inbound_queue_agent_performance",
  "inbound_queue_repeated_callers",
  // Unanswered Reports
  "unanswered_summary",
  "inbound_unanswered_date_distribution",
  "inbound_unanswered_hourly_distribution",
  "outbound_unanswered_date_distribution",
  "outbound_unanswered_hourly_distribution",
  // Agent Reports
  "agent_summary",
  "agent_call_distribution",
  "agent_sla_compliance",
];

// Legacy export for backward compatibility - will be removed
// Use useReportOptions hook instead for translated labels
export const REPORT_OPTIONS = REPORT_TYPE_VALUES.map((value) => ({
  label: value,
  value,
}));

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

export const shouldShowQueues = (reportType: ReportType | undefined): boolean => {
  if (!reportType) return false;
  return UNANSWERED_QUEUE_CALLS_REPORTS.includes(reportType);
};

export const shouldShowWaitTimeThreshold = (reportType: ReportType | undefined): boolean => {
  if (!reportType) return false;
  return UNANSWERED_QUEUE_CALLS_REPORTS.includes(reportType);
};
