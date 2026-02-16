"use client";
import { redirect } from "next/navigation";
import withActiveOrganization from "@/containers/withActiveOrganization";

const Autodialer = () => {
  return redirect("/auto-dialer/active");
};

export default withActiveOrganization(Autodialer);
