"use client";
import withPermission from "@/containers/withPermission";
import SurveyCdrsTable from "./table";

const SurveyCdrs = () => {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="border rounded-xl flex-1 flex flex-col overflow-hidden">
        <SurveyCdrsTable />
      </div>
    </div>
  );
};

export default withPermission(SurveyCdrs, "fullAccessSurvey");
