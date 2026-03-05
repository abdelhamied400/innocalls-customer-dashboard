"use client";

import { redirect } from "next/navigation";
import withActiveOrganization from "@/containers/withActiveOrganization";

const Analytics = () => {
  redirect("/analytics/inbound");
};

export default withActiveOrganization(Analytics);
