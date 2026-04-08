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

export type PostCallSurveyListResponse = {
  data: {
    surveys: PostCallSurvey[];
    totalItems: number;
    totalPages: number;
  };
};
