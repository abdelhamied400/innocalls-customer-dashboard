import { CallReceived } from "@mui/icons-material";
import StatsCard from "../StatsCard";

const TotalIncomingCalls = () => {
  return (
    <StatsCard
      title="Total Incoming"
      value="12,847"
      info="+8.2% vs last month"
      icon={<CallReceived />}
      color="primary"
    />
  );
};

export default TotalIncomingCalls;
