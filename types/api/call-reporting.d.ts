import { Extension } from "./extension";

type CallMember = {
  name: string;
  number: string;
};
export type Call = {
  callSummary?: string;
  call_status: "Answered" | "Busy" | "Failed" | "Not Answered";
  canListenToRecords: boolean;
  direction: "incoming" | "outgoing";
  duration: string;
  hasRecording: boolean;
  id: string;
  isRecordableCall: boolean;
  from: CallMember;
  to: CallMember;
  datetime: {
    date: string;
    time: string;
  };
};

type ExtensionOption = {
  label: string;
  value: string;
};

export type CallReportingFilters = {
  sourceExtensions?: string | ExtensionOption[];
  destinationExtensions?: string | ExtensionOption[];
  fromDate?: Date;
  toDate?: Date;
  callStatuses?: string;
  tags?: string;
  search?: string;
};

export type ExportCallReportingFilters = CallReportingFilters & {
  userEmail: string;
};
