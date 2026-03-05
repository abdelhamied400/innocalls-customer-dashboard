"use client";
import withPermission from "@/containers/withPermission";
import NumbersTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const Numbers = () => {
  return (
    <div className="page h-full" id="numbers">
      <NumbersTable />
    </div>
  );
};

export default withActiveOrganization(withPermission(Numbers, "fullAccessNumbers"));
