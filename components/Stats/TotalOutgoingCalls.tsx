import { CallMade } from "@mui/icons-material";
import StatsCard from "../StatsCard";

const TotalOutgoingCalls = () => {
  return (
    <StatsCard
      title="Total Outgoing"
      value="8,234"
      info="+5.1% vs last month"
      icon={<CallMade />}
      color="success"
    />
  );
};

export default TotalOutgoingCalls;
