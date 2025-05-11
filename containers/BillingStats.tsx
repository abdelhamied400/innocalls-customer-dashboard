import Balance from "@/components/Stats/Balance";
import Last30DaysUsage from "@/components/Stats/Last30DaysUsage";
import OverdueInvoices from "@/components/Stats/OverdueInvoices";

const BillingStats = () => {
  return (
    <div className="billing-stats">
      <h3>Billing Details</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        <Balance />
        <Last30DaysUsage />
        <OverdueInvoices />
      </div>
    </div>
  );
};

export default BillingStats;
