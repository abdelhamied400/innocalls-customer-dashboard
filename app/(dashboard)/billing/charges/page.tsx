"use client";

import ChargesTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const Charges = () => {
  return (
    <div className="page h-full" id="charges">
      <ChargesTable />
    </div>
  );
};

export default withActiveOrganization(Charges);
