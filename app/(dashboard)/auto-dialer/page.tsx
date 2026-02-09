"use client";

import { redirect } from "next/navigation";
import withActiveOrganization from "@/containers/withActiveOrganization";

const Other = () => {
  redirect("/auto-dialer/active");
};

export default withActiveOrganization(Other);
