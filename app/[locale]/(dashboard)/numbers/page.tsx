"use client";
import withPermission from "@/containers/withPermission";
import NumbersTable from "./table";

const Numbers = () => {
  return (
    <div className="page h-full" id="numbers">
      <NumbersTable />
    </div>
  );
};

export default withPermission(Numbers, "fullAccessNumbers");
