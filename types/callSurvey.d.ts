export type CallSurvey = {
  id: string;
  name: string;
  status: string;
  isDraft: boolean;
  createdAt: string;
};

export type CallSurveyQuestion = {
  id: string;
  type: string;
  soundFileName: string;
};

export type CallSurveyTimeSlot = {
  id: string;
  fromTime: string;
  toTime: string;
};

export type CallSurveyCaller = {
  destination: string;
  callerNumber: string;
};

export type CallSurveyDetail = {
  id: string;
  name: string;
  status: string;
  isDraft: boolean;
  createdAt: string;
  trialsCount: number;
  concurrencyCalls: number;
  delayMinutesBetweenTrials: number;
  dtmfTimeout: number;
  maxQuestionAttempts: number;
  timezone: string;
  startSoundFileName: string;
  endSoundFileName: string;
  wrongAnswerSoundFileName: string;
  questions: CallSurveyQuestion[];
  timeSlots: CallSurveyTimeSlot[];
  callers: CallSurveyCaller[];
};
