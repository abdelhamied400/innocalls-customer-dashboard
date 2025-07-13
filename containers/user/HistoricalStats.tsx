const HistoricalStats = () => {
  return (
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
              <div className="text-xs text-green-600">+8.2% vs last month</div>
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
                <span className="text-sm font-medium text-gray-800">1,847</span>
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
  );
};

export default HistoricalStats;
