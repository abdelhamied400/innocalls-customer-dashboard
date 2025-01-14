import api from "./api";

type FetchActiveCampaignsResponse = {
  totalPages: number;
  campaigns: {
    createdAt: string;
    name: string;
    durationType: string;
    status: string;
  }[];
};
const fetchActiveCampaigns = (filters?: any): FetchActiveCampaignsResponse => {
  console.log("Fetching all auto dialer campaigns", filters);
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    totalPages: 10,
    campaigns: [
      {
        createdAt: "1 Sep 2025",
        name: "Single line",
        durationType: "Time Limited",
        status: "paused",
      },
      ...Array.from({ length: 10 }).map((_, i) => ({
        createdAt: "1 Sep 2025",
        name: "Single line",
        durationType: "Time Limited",
        status: "played",
      })),
    ],
  };
  // const res = await api.get("/api/auto-dialer/campaigns");
  // return res.data;
};

const AutoDialerService = {
  fetchActiveCampaigns,
};

export default AutoDialerService;
