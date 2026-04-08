export type PostCallSurvey = {
  id: string;
  name: string;
  createdAt: string;
};

export type PostCallSurveyQuestion = {
  type: "one_five" | "one_ten" | "yes_no";
  soundFilePath: string;
  soundFileName: string;
};

export type PostCallSurveyDetail = {
  id: string;
  name: string;
  startSoundFileName: string;
  endSoundFileName: string;
  wrongAnswerSoundFileName: string;
  allowDTMFInputDuringPlayback: boolean;
  maxQuestionAttempts: number;
  dtmfTimeout: number;
  questions: PostCallSurveyQuestion[];
};

export type PostCallSurveyDetailResponse = {
  data: {
    survey: PostCallSurveyDetail;
  };
};

export type PostCallSurveyCdrAnswer = {
  questionIndex: number;
  userResponse: number;
  isCorrect: boolean;
  attemptNumber: number;
  responseTime: number;
  questionType: string;
};

export type PostCallSurveyCdrAgent = {
  id: string;
  name: string;
  ext: number;
};

export type PostCallSurveyCdr = {
  id: string;
  ext: number;
  phone: string;
  agent: PostCallSurveyCdrAgent | null;
  status: string;
  answers: PostCallSurveyCdrAnswer[];
  completionStatus: string;
  answeredQuestionsCount: number;
  correctAnswersCount: number;
  channelId: string;
  duration: string;
  createdAt: string;
  survey: string;
};

export type PostCallSurveyCdrsResponse = {
  data: {
    requests: PostCallSurveyCdr[];
    totalItems: number;
    totalPages: number;
  };
};

export type PostCallSurveyListResponse = {
  data: {
    surveys: PostCallSurvey[];
    totalItems: number;
    totalPages: number;
  };
};
