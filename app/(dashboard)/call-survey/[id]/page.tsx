"use client";
import { redirect, useParams } from "next/navigation";

const CallSurveyDetail = () => {
  const { id } = useParams();
  return redirect(`/call-survey/${id}/details/metrics`);
};

export default CallSurveyDetail;
