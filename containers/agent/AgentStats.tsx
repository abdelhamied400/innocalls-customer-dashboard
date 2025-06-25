import LastHourCallsDuration from "@/components/Stats/LastHourCallsDuration";
import LiveCallsCount from "@/components/Stats/LiveCallsCount";
import TodayCallsDuration from "@/components/Stats/TodayCallsDuration";
import { useTranslations } from "next-intl";

const AgentStats = () => {
  const t = useTranslations("dashboard.containers");

  return (
    <div className="agent-stats">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        <h1>not implemented</h1>
        {/* <LiveCallsCount />
        <LastHourCallsDuration />
        <TodayCallsDuration /> */}
      </div>
    </div>
  );
};

export default AgentStats;
