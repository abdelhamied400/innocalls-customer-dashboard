export type CallBridge = {
  id: string;
  _id?: string;
  name: string;
  createdAt: string;
};

export type CallBridgeDetail = {
  id: string;
  name: string;
  callers: {
    destination: string;
    callerNumber: string;
  }[];
  welcomeSoundFileName: string;
  welcomeSoundFilePath: string;
  alertSoundFileName: string;
  alertSoundFilePath: string;
  firstRecipientSorrySoundFileName: string;
  firstRecipientSorrySoundFilePath: string;
  secondRecipientSorrySoundFileName: string;
  secondRecipientSorrySoundFilePath: string;
  warningSoundFileName?: string;
  warningSoundFilePath?: string;
  firstRecipientTrialsCount: number;
  secondRecipientTrialsCount: number;
  firstRecipientDelayMinutesBetweenTrials: number;
  secondRecipientDelayMinutesBetweenTrials: number;
  warningTimeBeforeEnd?: number;
  createdAt?: string;
};

export type UploadSoundResponse = {
  path: string;
  originalName: string;
};

export type CallBridgeCall = {
  id: string;
  firstRecipient: {
    name: string;
    phone: string;
  };
  secondRecipient: {
    name: string;
    phone: string;
  };
  status: string;
  scheduleDuration: string;
  timezone: string;
  scheduleDateTime: string;
  uniqueIdentifier?: string;
  recordingLink?: string;
  endCallStatus: string;
  matchesScheduledDuration: boolean;
  callOutcome?: {
    callDuration: number;
    talkTime: string;
    firstRecipientTrials: number;
    secondRecipientTrials: number;
    firstRecipientLastAttemptTime: string | null;
    secondRecipientLastAttemptTime: string | null;
    firstRecipientLastCallStatus: string;
    secondRecipientLastCallStatus: string;
    firstCallerNumber?: string;
    secondCallerNumber?: string;
    isConnected: boolean;
    summary?: {
      en: string;
      ar: string;
    };
  };
};

export type FetchCallBridgeCallsResponse = {
  calls: CallBridgeCall[];
  totalItems: number;
  totalPages: number;
};

export type CreateCallBridgeCallPayload = {
  duration: number;
  timezone: string;
  dateTime: string;
  firstRecipient: {
    name: string;
    phone: string;
  };
  secondRecipient: {
    name: string;
    phone: string;
  };
  conferenceBridgeFlow: string;
};
