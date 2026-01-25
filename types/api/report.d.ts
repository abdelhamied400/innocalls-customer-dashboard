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
