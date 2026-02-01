export type ReportType =
  // Outbound Reports
  | "outbound_summary"
  | "outbound_agent_stats"
  | "outbound_date_distribution"
  | "outbound_hourly_distribution"
  // Inbound Agent Reports
  | "inbound_agent_summary"
  | "inbound_agent_date_distribution"
  | "inbound_agent_hourly_distribution"
  // Inbound Queue Reports
  | "inbound_queue_summary"
  | "inbound_queue_date_distribution"
  | "inbound_queue_hourly_distribution"
  | "inbound_queue_agent_performance"
  | "inbound_queue_repeated_callers"
  // Unanswered Reports
  | "unanswered_summary"
  | "inbound_unanswered_date_distribution"
  | "inbound_unanswered_hourly_distribution"
  | "outbound_unanswered_date_distribution"
  | "outbound_unanswered_hourly_distribution"
  // Agent Reports
  | "agent_summary"
  | "agent_call_distribution"
  | "agent_sla_compliance";

export type OneTimeReportStatus = "pending" | "processing" | "completed" | "failed";

export type OneTimeReportConfig = {
  fromDate: string;
  toDate: string;
  includeInternalCalls?: boolean;
  extensions?: string[];
  timezone?: string;
  sla?: number;
  queue?: string;
};

export type OneTimeReport = {
  id: string;
  name: string;
  recipients: string[];
  emailSubject: string;
  report: ReportType;
  reportConfig: OneTimeReportConfig;
  status: OneTimeReportStatus;
  createdAt: string;
};

export type OneTimeReportFilters = {
  name?: string;
  fromDate?: Date;
  toDate?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type CreateOneTimeReportPayload = {
  name: string;
  recipients: string[];
  emailSubject: string;
  report: ReportType;
  reportConfig: {
    fromDate: string;
    toDate: string;
    includeInternalCalls?: boolean;
    extensions?: string; // Comma-separated numbers e.g. "101,102,103"
    sla?: number;
    queue?: string;
  };
};

export type OneTimeReportListResponse = {
  data: OneTimeReport[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

export type OneTimeReportResponse = {
  report: OneTimeReport;
};

export type ScheduledReportSchedule = "daily" | "weekly" | "monthly";
export type ScheduledReportStatus = "active" | "inactive";

export type ScheduledReport = {
  id: string;
  createdAt: string;
  name: string;
  scheduled: ScheduledReportSchedule;
  status: ScheduledReportStatus;
  nextGeneration: string;
  recipients: string[];
};

export type ScheduledReportFilters = {
  search?: string;
  fromDate?: Date;
  toDate?: Date;
  scheduled?: ScheduledReportSchedule;
  status?: ScheduledReportStatus;
};
