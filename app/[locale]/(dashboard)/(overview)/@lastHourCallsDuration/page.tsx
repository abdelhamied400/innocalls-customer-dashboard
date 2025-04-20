import StatsCard from "@/components/StatsCard";

const LastHourCallsDuration = () => {
  return (
    <StatsCard
      icon={
        <img
          src="/assets/icons/stats/hourglass.svg"
          alt="Last Hour Calls Icon"
        />
      }
      title="Total call duration last hour"
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

export default LastHourCallsDuration;
