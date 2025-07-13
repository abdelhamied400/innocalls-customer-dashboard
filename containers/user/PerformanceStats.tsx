import CallsTrendChart from "@/components/Stats/CallsTrendChart";
import PerformanceOverviewChart from "@/components/Stats/PerformanceOverviewChart";

const PerformanceStats = () => {
  return (
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
  );
};

export default PerformanceStats;
