import StatsCard from "@/components/StatsCard";

const TodayCallsDuration = () => {
  return (
    <StatsCard
      icon={<img src="/assets/icons/stats/timer.svg" alt="Today Calls Icon" />}
      title="Total call duration today"
      value="00H 00M 00S" // Replace with actual data
      className="shadow-none"
      info={
        <p className="text-sm text-gray-500">
          Based on <span className="font-bold">1000</span> calls of total{" "}
          <span className="font-bold">20,000</span> calls
        </p>
      }
    ></StatsCard>
  );
};

export default TodayCallsDuration;
