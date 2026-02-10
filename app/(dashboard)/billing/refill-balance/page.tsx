"use client";

import RefillBalanceForm from "./form";
import withActiveOrganization from "@/containers/withActiveOrganization";

const RefillBalance = () => {
  return (
    <div className="page h-full" id="refill-balance">
      <RefillBalanceForm />
    </div>
  );
};

export default withActiveOrganization(RefillBalance);
