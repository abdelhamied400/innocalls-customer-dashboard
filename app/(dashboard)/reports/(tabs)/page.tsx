"use client";

import { redirect } from "next/navigation";
import withActiveOrganization from "@/containers/withActiveOrganization";

const ReportsPage = () => {
  redirect("/reports/one-time");
};

export default withActiveOrganization(ReportsPage);
