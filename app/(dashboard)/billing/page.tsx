"use client";

import { redirect } from "next/navigation";
import withActiveOrganization from "@/containers/withActiveOrganization";

const Billing = () => {
  return redirect("/billing/charges");
};

export default withActiveOrganization(Billing);
