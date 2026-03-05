"use client";

import RatesTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const Rates = () => {
  return (
    <div className="page h-full" id="rates">
      <RatesTable />
    </div>
  );
};

export default withActiveOrganization(Rates);
