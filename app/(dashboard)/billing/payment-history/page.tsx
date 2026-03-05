"use client";

import PaymentHistoryTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const PaymentHistory = () => {
  return (
    <div className="page h-full" id="payment-history">
      <PaymentHistoryTable />
    </div>
  );
};

export default withActiveOrganization(PaymentHistory);
