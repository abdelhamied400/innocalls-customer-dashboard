"use client";

import CreateReportForm from "./form";
import withActiveOrganization from "@/containers/withActiveOrganization";

const CreateReportPage = () => {
  return (
    <div className="page h-full" id="create-scheduled-report">
      <CreateReportForm />
    </div>
  );
};

export default withActiveOrganization(CreateReportPage);
