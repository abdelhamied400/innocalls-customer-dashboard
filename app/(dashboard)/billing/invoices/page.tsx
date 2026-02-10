"use client";

import InvoicesTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const Invoices = () => {
  return (
    <div className="page h-full" id="invoices">
      <InvoicesTable />
    </div>
  );
};

export default withActiveOrganization(Invoices);
