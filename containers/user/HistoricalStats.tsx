import StatsDetailedCard from "@/components/StatsDetailedCard";
import PercentBarStat from "@/components/PercentBarStat";
import { AvTimer, Call, HourglassEmpty } from "@mui/icons-material";
import StatsSubCard from "@/components/StatsSubCard";
import StatsMetricCard from "@/components/StatsMetricCard";

const HistoricalStats = () => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatsDetailedCard
          title="Total Calls"
          value="12,847"
          subtitle="Last 30 Days"
          valueSubtitle="+8.2% vs last month"
          icon={<Call />}
          color="primary"
        >
          <PercentBarStat
            label="Completed Calls"
            value="10,234"
            percentage={80}
            color="green"
            showPercentage
          />
          <PercentBarStat
            label="Abandoned Calls"
            value="1,847"
            percentage={14}
            color="orange"
            showPercentage
          />
          <PercentBarStat
            label="Timeout Calls"
            value="766"
            percentage={6}
            color="red"
            showPercentage
          />
        </StatsDetailedCard>

        {/* Last 30 Days Talk Time */}
        <StatsDetailedCard
          title="Talk Time"
          value="1,247h"
          subtitle="Last 30 Days"
          valueSubtitle="+12% vs last month"
          icon={<AvTimer />}
          color="success"
        >
          {/* Talk Time Metrics */}
          <div className="space-y-4">
            <StatsMetricCard
              label="Average per Call"
              value="4m 32s"
              color="success"
              performanceChange="+18s vs last month"
            />

            <div className="grid grid-cols-2 gap-3">
              <StatsSubCard
                color="success"
                value="41.5h"
                label="Daily Average"
              />
              <StatsSubCard color="success" value="2.9h" label="Peak Hour" />
            </div>
          </div>
        </StatsDetailedCard>

        {/* Last 30 Days Waiting Time */}
        <StatsDetailedCard
          title="Wait Time"
          value="847h"
          subtitle="Last 30 Days"
          valueSubtitle="-5% vs last month"
          icon={<HourglassEmpty />}
          color="info"
        >
          {/* Wait Time Metrics */}
          <div className="space-y-4">
            <StatsMetricCard
              label="Average Wait"
              value="2m 18s"
              color="info"
              performanceChange="-12s vs last month"
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completed Calls</span>
                <span className="font-medium text-gray-800">1m 45s avg</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Abandoned Calls</span>
                <span className="font-medium text-gray-800">3m 12s avg</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Timeout Calls</span>
                <span className="font-medium text-gray-800">5m 30s avg</span>
              </div>
            </div>
          </div>
        </StatsDetailedCard>

        {/* <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <span className="text-orange-600 text-lg group-hover:text-white transition-colors">
                  ⏳
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-500 transition-colors">
                  Wait Time
                </h3>
                <p className="text-sm text-gray-500">Last 30 Days</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600 group-hover:text-primary-500 transition-colors">
                847h
              </div>
              <div className="text-xs text-orange-600">-5% vs last month</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg group-hover:from-primary-500/10 group-hover:to-primary-400/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-800 group-hover:text-primary-500 transition-colors">
                  Average Wait
                </span>
                <span className="text-lg font-bold text-orange-800 group-hover:text-primary-500 transition-colors">
                  2m 18s
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full group-hover:bg-primary-500 transition-colors"></div>
                <span className="text-xs text-orange-700 group-hover:text-primary-500 transition-colors">
                  -12s vs last month
                </span>
              </div>
            </div>

            
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default HistoricalStats;
