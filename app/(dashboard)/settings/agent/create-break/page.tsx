"use client";

import CreateBreakForm from "./form";
import withActiveOrganization from "@/containers/withActiveOrganization";

const CreateBreakPage = () => {
  return (
    <div className="page h-full" id="create-break">
      <CreateBreakForm />
    </div>
  );
};

export default withActiveOrganization(CreateBreakPage);
