"use client";
import { redirect } from "next/navigation";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const CallSurvey = () => {
  return redirect("/call-survey/active");
};

export default withActiveOrganization(
  withPermission(CallSurvey, "fullAccessSurvey")
);
