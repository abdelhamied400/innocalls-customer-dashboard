import Balance from "@/components/Stats/Balance";
import Last30DaysUsage from "@/components/Stats/Last30DaysUsage";
import OverdueInvoices from "@/components/Stats/OverdueInvoices";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

const BillingStats = () => {
  const { data: session } = useSession();

  return (
    <div className="billing-stats">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {session?.user.completeControlBilling && <Balance />}
        {session?.user.fullAccessUsageAnalytics && <Last30DaysUsage />}
        {session?.user.completeControlBilling && <OverdueInvoices />}
      </div>
    </div>
  );
};

export default BillingStats;
