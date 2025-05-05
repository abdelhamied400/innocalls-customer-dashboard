import statsService from "@/services/stats.service";

const ErgInProgressCallsCount = async () => {
  const res = await statsService.getErgInProgressCallsCount();
  console.log("In Progress Calls Count2", res);

  return (
    <div className="bg-white p-4 rounded-lg h-full flex flex-col gap-2">
      <div className="mb-4">
        <h3>Total Answered Calls/Day</h3>
      </div>

      <div className="flex flex-col gap-2">
        {/* <div className="flex justify-between">
          <span>Total Calls:</span>
          <span>{data.totalCalls}</span>
        </div>
        <div className="flex justify-between">
          <span>Answered Calls:</span>
          <span>{data.answeredCalls}</span>
        </div>
        <div className="flex justify-between">
          <span>Missed Calls:</span>
          <span>{data.missedCalls}</span>
        </div>
        <div className="flex justify-between">
          <span>Waiting Calls:</span>
          <span>{data.waitingCalls}</span>
        </div>
        <div className="flex justify-between">
          <span>Today's Calls:</span>
          <span>{data.todayCalls}</span>
        </div>
        <div className="flex justify-between">
          <span>Yesterday's Calls:</span>
          <span>{data.yesterdayCalls}</span>
        </div> */}
      </div>
    </div>
  );
};

export default ErgInProgressCallsCount;
