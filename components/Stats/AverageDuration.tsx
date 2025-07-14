import { TimerOutlined } from "@mui/icons-material";
import StatsCard from "../StatsCard";

const AverageDuration = () => {
  return (
    <StatsCard
      title="Avg Duration"
      value="4m 32s"
      info="+12s vs last month"
      icon={<TimerOutlined />}
      color="warning"
    />
  );
};

export default AverageDuration;
