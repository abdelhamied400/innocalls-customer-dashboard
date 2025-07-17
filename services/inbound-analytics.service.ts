import { format } from "date-fns";
import api from "./api";

type GetAnalyticsStatsResponse = {};

export default {
  getAnalyticsStats: async (
    fromDate: Date,
    toDate: Date
  ): Promise<GetAnalyticsStatsResponse> => {
    const res = await api.get(
      `/inbound-queue-reports/summary?from=${format(
        fromDate,
        "yyyy-MM-dd"
      )}&to=${format(toDate, "yyyy-MM-dd")}`
    );
    return res.data;
  },
};
