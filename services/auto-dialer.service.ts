import api from "./api";

export const fetchAllAutoDialerCampaigns = async (filters?: any) => {
  console.log("Fetching all auto dialer campaigns", filters);
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return [
    {
      createdAt: "1 Sep 2025",
      name: "Single line",
      durationType: "Time Limited",
      status: "paused",
    },
    {
      createdAt: "1 Sep 2025",
      name: "Single line",
      durationType: "Time Limited",
      status: "played",
    },
  ];
  const res = await api.get("/api/auto-dialer/campaigns");
  return res.data;
};
