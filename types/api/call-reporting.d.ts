import { Extension } from "./extension";

type CallMember = {
  name: string;
  number: string;
};
export type Call = {
  callSummary?: {
    addedBy: string;
    comment: string;
    postCallTags: string[];
  };
  call_status: "Answered" | "Busy" | "Failed" | "Not Answered";
  canListenToRecords: boolean;
  direction: "incoming" | "outgoing" | "local";
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

export type Option = {
  label: string;
  value: string;
};

export type CallReportingFilters = {
  sourceExtensions?: string | Option[];
  destinationExtensions?: string | Option[];
  fromDate?: Date;
  toDate?: Date;
  callStatuses?: string;
  tags?: string | Option[];
  search?: string;
};

export type ExportCallReportingFilters = CallReportingFilters & {
  userEmail: string;
};

export type PhoneHistoryCall = {
  direction: string;
  answered: boolean;
  duration: string;
  holdTime: string;
  dateTime: {
    date: string;
    time: string;
  };
  ext: {
    ext: string;
    name: string;
  };
};

export type PhoneHistoryItem = {
  id: string;
  isAnswered: boolean;
  duration: string;
  totalHoldTime: string;
  latestTime: {
    date: string;
    time: string;
  };
  direction: string;
  calls: PhoneHistoryCall[];
};

export type PhoneHistoryResponse = {
  callsHistory: PhoneHistoryItem[];
};
