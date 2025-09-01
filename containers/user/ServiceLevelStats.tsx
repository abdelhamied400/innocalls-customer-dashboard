import LastHourCallsDuration from "@/components/Stats/LastHourCallsDuration";
import LiveCallsCount from "@/components/Stats/LiveCallsCount";
import TodayCallsDuration from "@/components/Stats/TodayCallsDuration";
import { useTranslations } from "@/providers/TranslationProvider";

const ServiceLevelStats = () => {
  const t = useTranslations("dashboard.containers");

  return (
    <div className="service-level-stats">
      <h3>{t("serviceLevelStats")}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        <LiveCallsCount />
        <LastHourCallsDuration />
        <TodayCallsDuration />
      </div>
    </div>
  );
};

export default ServiceLevelStats;
