"use client";
import withPermission from "@/containers/withPermission";
import SurveyCdrsTable from "./table";

const SurveyCdrs = () => {
  return (
    <div className="call-survey-cdrs bg-white rounded-xl p-4 h-auto sm:h-full flex flex-col gap-2">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden">
        <SurveyCdrsTable />
      </div>
    </div>
  );
};

export default withPermission(SurveyCdrs, "fullAccessSurvey");
