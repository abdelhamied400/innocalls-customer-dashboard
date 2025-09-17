import Balance from "@/components/Stats/Balance";
import Last30DaysUsage from "@/components/Stats/Last30DaysUsage";
import OverdueInvoices from "@/components/Stats/OverdueInvoices";
import useAuth from "@/hooks/useAuth";

const BillingStats = () => {
  const { data: auth } = useAuth();

  return (
    <div className="billing-stats">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {auth?.user?.completeControlBilling && <Balance />}
        {auth?.user?.completeControlBilling && <Last30DaysUsage />}
        {auth?.user?.completeControlBilling && <OverdueInvoices />}
      </div>
    </div>
  );
};

export default BillingStats;
