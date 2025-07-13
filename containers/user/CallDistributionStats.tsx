import CallDistribution from "@/components/Stats/CallDistribution";
import TotalAnsweredCalls from "@/components/Stats/TotalAnsweredCalls";
import { useTranslations } from "next-intl";
import CallsTrendChart from "@/components/Stats/CallsTrendChart";
import PerformanceOverviewChart from "@/components/Stats/PerformanceOverviewChart";

const CallDistributionStats = () => {
  const t = useTranslations("dashboard.containers");

  return (
    <div className="call-distribution-stats">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Call Distribution Chart */}
        <div className="xl:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="h-80">
            <CallDistribution />
          </div>
        </div>

        {/* Total Answered Calls Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-full relative overflow-hidden">
          <div className="h-full">
            <TotalAnsweredCalls />
          </div>
        </div>
      </div>
      {/* Call Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {/* Total Incoming */}
        <div className="p-4 bg-white shadow-sm rounded-lg hover:shadow-lg transition-shadow text-gray-800 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <span className="text-green-600 text-sm group-hover:text-white transition-colors">
                  📥
                </span>
              </div>
              <h3 className="text-lg text-gray-500">Total Incoming</h3>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-2xl text-gray-800 group-hover:text-primary-500 transition-colors">
              12,847
            </p>
            <p className="text-xs text-green-600">+8.2% vs last month</p>
          </div>
        </div>

        {/* Total Outgoing */}
        <div className="p-4 bg-white shadow-sm rounded-lg hover:shadow-lg transition-shadow text-gray-800 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <span className="text-blue-600 text-sm group-hover:text-white transition-colors">
                  📤
                </span>
              </div>
              <h3 className="text-lg text-gray-500">Total Outgoing</h3>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-2xl text-gray-800 group-hover:text-primary-500 transition-colors">
              8,234
            </p>
            <p className="text-xs text-blue-600">+5.1% vs last month</p>
          </div>
        </div>

        {/* Answer Rate */}
        <div className="p-4 bg-white shadow-sm rounded-lg hover:shadow-lg transition-shadow text-gray-800 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <span className="text-purple-600 text-sm group-hover:text-white transition-colors">
                  🎯
                </span>
              </div>
              <h3 className="text-lg text-gray-500">Answer Rate</h3>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-2xl text-gray-800 group-hover:text-primary-500 transition-colors">
              94.2%
            </p>
            <p className="text-xs text-purple-600">+2.1% vs last month</p>
          </div>
        </div>

        {/* Avg Duration */}
        <div className="p-4 bg-white shadow-sm rounded-lg hover:shadow-lg transition-shadow text-gray-800 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <span className="text-orange-600 text-sm group-hover:text-white transition-colors">
                  ⏱️
                </span>
              </div>
              <h3 className="text-lg text-gray-500">Avg Duration</h3>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-2xl text-gray-800 group-hover:text-primary-500 transition-colors">
              4m 32s
            </p>
            <p className="text-xs text-orange-600">+12s vs last month</p>
          </div>
        </div>
      </div>

      {/* Historical Stats Component */}
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Last 30 Days Calls Summary */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  <span className="text-blue-600 text-lg group-hover:text-white transition-colors">
                    📞
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-500 transition-colors">
                    Total Calls
                  </h3>
                  <p className="text-sm text-gray-500">Last 30 Days</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 group-hover:text-primary-500 transition-colors">
                  12,847
                </div>
                <div className="text-xs text-green-600">
                  +8.2% vs last month
                </div>
              </div>
            </div>

            {/* Call Status Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">
                    10,234
                  </span>
                  <span className="text-xs text-gray-500">(80%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Abandoned</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">
                    1,847
                  </span>
                  <span className="text-xs text-gray-500">(14%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: "14%" }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Timeout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">766</span>
                  <span className="text-xs text-gray-500">(6%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: "6%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Last 30 Days Talk Time */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  <span className="text-green-600 text-lg group-hover:text-white transition-colors">
                    ⏱️
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-500 transition-colors">
                    Talk Time
                  </h3>
                  <p className="text-sm text-gray-500">Last 30 Days</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 group-hover:text-primary-500 transition-colors">
                  1,247h
                </div>
                <div className="text-xs text-green-600">+12% vs last month</div>
              </div>
            </div>

            {/* Talk Time Metrics */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg group-hover:from-primary-500/10 group-hover:to-primary-400/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800 group-hover:text-primary-500 transition-colors">
                    Average per Call
                  </span>
                  <span className="text-lg font-bold text-green-800 group-hover:text-primary-500 transition-colors">
                    4m 32s
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full group-hover:bg-primary-500 transition-colors"></div>
                  <span className="text-xs text-green-700 group-hover:text-primary-500 transition-colors">
                    +18s vs last month
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg group-hover:bg-primary-500/5 transition-colors">
                  <div className="text-lg font-bold text-gray-800 group-hover:text-primary-500 transition-colors">
                    41.5h
                  </div>
                  <div className="text-xs text-gray-600">Daily Average</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg group-hover:bg-primary-500/5 transition-colors">
                  <div className="text-lg font-bold text-gray-800 group-hover:text-primary-500 transition-colors">
                    2.9h
                  </div>
                  <div className="text-xs text-gray-600">Peak Hour</div>
                </div>
              </div>
            </div>
          </div>

          {/* Last 30 Days Waiting Time */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
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

            {/* Wait Time Metrics */}
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

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completed Calls</span>
                  <span className="font-medium text-gray-800 group-hover:text-primary-500 transition-colors">
                    1m 45s avg
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Abandoned Calls</span>
                  <span className="font-medium text-gray-800 group-hover:text-primary-500 transition-colors">
                    3m 12s avg
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Timeout Calls</span>
                  <span className="font-medium text-gray-800 group-hover:text-primary-500 transition-colors">
                    5m 30s avg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Peak Day */}
        <div className="p-4 bg-white shadow-sm rounded-lg hover:shadow-lg transition-shadow text-gray-800 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <span className="text-blue-600 text-sm group-hover:text-white transition-colors">
                  📈
                </span>
              </div>
              <h3 className="text-lg text-gray-500">Peak Day</h3>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-2xl text-gray-800 group-hover:text-primary-500 transition-colors">
              Wednesday
            </p>
          </div>
        </div>

        {/* Avg Daily Calls */}
        <div className="p-4 bg-white shadow-sm rounded-lg hover:shadow-lg transition-shadow text-gray-800 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <span className="text-green-600 text-sm group-hover:text-white transition-colors">
                  📊
                </span>
              </div>
              <h3 className="text-lg text-gray-500">Avg Daily Calls</h3>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-2xl text-gray-800 group-hover:text-primary-500 transition-colors">
              1,247
            </p>
          </div>
        </div>

        {/* Best Response */}
        <div className="p-4 bg-white shadow-sm rounded-lg hover:shadow-lg transition-shadow text-gray-800 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <span className="text-orange-600 text-sm group-hover:text-white transition-colors">
                  ⚡
                </span>
              </div>
              <h3 className="text-lg text-gray-500">Best Response</h3>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-2xl text-gray-800 group-hover:text-primary-500 transition-colors">
              2.3s
            </p>
          </div>
        </div>
      </div>

      {/* Calls Trend and Performance Overview Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        {/* Calls Trend Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400"></div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-800">Calls Trend</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Total Calls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Missed</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <CallsTrendChart />
          </div>
        </div>

        {/* Performance Overview Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400"></div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-800">
              Performance Overview
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Talk Time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Wait Time</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <PerformanceOverviewChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallDistributionStats;
