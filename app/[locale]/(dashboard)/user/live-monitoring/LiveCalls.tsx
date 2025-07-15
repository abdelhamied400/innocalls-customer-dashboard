import LiveCall from "@/components/LiveMonitoring/LiveCall";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import { Call } from "@mui/icons-material";

const LiveCalls = () => {
  return (
    <div className="live-calls">
      <StatsDetailedCard
        title="Live Calls"
        subtitle="Real-time call monitoring and management"
        value="5"
        renderValue={
          <div className="value flex items-center gap-2">
            <div className="flex flex-col items-center text-center">
              <p className="font-bold text-2xl text-primary-500 transition-colors">
                5
              </p>
              <p className="text-sm">Active Calls</p>
              <p className="text-xs text-primary-500">+22.2% vs previous</p>
            </div>
            <div className="live flex items-center gap-1">
              <span className="block w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-green-500">Live</p>
            </div>
          </div>
        }
        icon={<Call />}
        color="primary"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <LiveCall
            from="+1 (555) 234-5678"
            to="+1 (800) 123-4567"
            duration="8:45"
          />
          <LiveCall
            from="+1 (555) 234-5678"
            to="+1 (800) 123-4567"
            duration="8:45"
          />
          <LiveCall
            from="+1 (555) 234-5678"
            to="+1 (800) 123-4567"
            duration="8:45"
          />
          <LiveCall
            from="+1 (555) 234-5678"
            to="+1 (800) 123-4567"
            duration="8:45"
          />
          <LiveCall
            from="+1 (555) 234-5678"
            to="+1 (800) 123-4567"
            duration="8:45"
          />
        </div>
      </StatsDetailedCard>
    </div>
  );
};

export default LiveCalls;
