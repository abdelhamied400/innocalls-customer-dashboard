"use client";

import { redirect } from "next/navigation";
import withActiveOrganization from "@/containers/withActiveOrganization";

const Settings = () => {
  return redirect("/settings/account");
};

export default withActiveOrganization(Settings);
