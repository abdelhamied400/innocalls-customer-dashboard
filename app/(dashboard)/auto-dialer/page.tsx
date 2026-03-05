"use client";
import { redirect } from "next/navigation";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const Autodialer = () => {
  return redirect("/auto-dialer/active");
};

export default withActiveOrganization(withPermission(Autodialer, "fullAccessAutoDialerCampaigns"));
