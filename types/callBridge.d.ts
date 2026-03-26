export type CallBridge = {
  id: string;
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
