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
  fileName: string;
};

export type CallSurveyCdrAnswer = {
  questionIndex: number;
  userResponse: number;
  isCorrect: boolean;
  attemptNumber: number;
  responseTime: number;
  questionType: string;
};

export type CallSurveyCdr = {
  id: string;
  status: string;
  completionStatus: string;
  duration: string;
  answers: CallSurveyCdrAnswer[];
  answeredQuestionsCount: number;
  correctAnswersCount: number;
  initiatedAt: string;
  recordingLink: string;
  phone: string;
  name: string;
};
