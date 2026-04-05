"use client";
import withPermission from "@/containers/withPermission";
import SurveyCdrsTable from "./table";

const SurveyCdrs = () => {
  return (
    <div className="border rounded-xl flex-1 flex flex-col overflow-hidden">
      <SurveyCdrsTable />
    </div>
  );
};

export default withPermission(SurveyCdrs, "fullAccessSurvey");
