export type Call = {
  callSummary?: string;
  call_date_time: string;
  call_status: "Answered" | "Busy" | "Failed" | "Not Answered";
  canListenToRecords: boolean;
  destination: string;
  direction: "incoming" | "outgoing";
  duration: string;
  hasRecording: boolean;
  id: string;
  isRecordableCall: boolean;
  source: string;
};

export type CallReportingFilters = {
  sourceExtensions?: string;
  destinationExtensions?: string;
  fromDate?: Date;
  toDate?: Date;
  callStatuses?: string;
  tags?: string;
  search?: string;
};
