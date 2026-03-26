"use client";
import { redirect } from "next/navigation";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const CallBridgePage = () => {
  return redirect("/call-bridge/list");
};

export default withActiveOrganization(
  withPermission(CallBridgePage, "fullAccessConferenceBridge"),
);
