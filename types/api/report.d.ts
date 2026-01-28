export type OneTimeReport = {
  id: string;
  createdAt: string;
  report: string;
  recipients: string[];
};

export type OneTimeReportFilters = {
  search?: string;
  fromDate?: Date;
  toDate?: Date;
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
