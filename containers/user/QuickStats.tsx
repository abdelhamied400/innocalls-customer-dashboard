const QuickStats = () => {
  return (
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
  );
};

export default QuickStats;
