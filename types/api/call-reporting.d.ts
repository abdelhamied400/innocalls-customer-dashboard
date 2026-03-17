import { Extension } from "./extension";

type CallMember = {
  name: string;
  number: string;
};
export type CallSentiment = {
  overall: "positive" | "negative" | "neutral" | "mixed";
  score: number;
  customer_sentiment: string;
  agent_sentiment: string;
};

export type AgentQualityScore = {
  score?: number | null;
  greeting?: number | null;
  closing?: number | null;
  professionalism?: number | null;
  product_knowledge?: number | null;
  objection_handling?: number | null;
  notes?: string | null;
};

export type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
  speaker: string;
};

export type CallTranscription = {
  status?: "completed" | "pending" | "processing";
  summary?: string;
  sentiment?: CallSentiment;
  topics?: string[];
  actionItems?: string[];
  agentQualityScore?: AgentQualityScore | null;
  transcriptSegments?: TranscriptSegment[];
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
  transcription?: CallTranscription;
};

export type AgentCall = {
  callSummary?: {
    addedBy: string;
    comment: string;
    postCallTags: string[];
  };
  dateTime: {
    date: string;
    time: string;
  };
  direction: "incoming" | "outgoing" | "local";
  duration: string;
  from: CallMember;
  hasRecording: boolean;
  id: string;
  isAnswered: boolean;
  to: CallMember;
  waitTime: string;
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

export type AgentCallReportingFilters = {
  fromDate?: Date;
  toDate?: Date;
  numbers?: string | Option[];
  isAnswered?: boolean;
  direction?: "incoming" | "outgoing" | "local";
  tags?: string | Option[];
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
  hasRecording: boolean;
  calls: PhoneHistoryCall[];
};

export type PhoneHistoryResponse = {
  callsHistory: PhoneHistoryItem[];
};
