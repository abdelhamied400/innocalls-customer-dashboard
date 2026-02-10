"use client";

import { use } from "react";

import EditReportForm from "./form";
import withActiveOrganization from "@/containers/withActiveOrganization";

type EditReportPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EditReportPage = ({ params }: EditReportPageProps) => {
  const { id } = use(params);

  return (
    <div className="page h-full" id="edit-scheduled-report">
      <EditReportForm reportId={id} />
    </div>
  );
};

export default withActiveOrganization(EditReportPage);
