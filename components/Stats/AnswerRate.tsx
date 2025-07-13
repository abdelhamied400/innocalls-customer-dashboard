import { Call } from "@mui/icons-material";
import StatsCard from "../StatsCard";

const AnswerRate = () => {
  return (
    <StatsCard
      title="Answer Rate"
      value="94.2%"
      info="+2.1% vs last month"
      icon={<Call />}
      variant="ghost"
      color="info"
    />
  );
};

export default AnswerRate;
