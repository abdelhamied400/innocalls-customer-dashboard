import { objToQueryString } from "@/lib/utils";
import api from "./api";

export default {
  getChargesList: async (
    pageIndex: number,
    pageSize: number,
    filters: Object
  ) => {
    const queryString = objToQueryString(filters);
    const res = await api.get(
      `/jera/charge-list?itemsPerPage=${pageSize}&page=${pageIndex}&${queryString}`
    );
    return res.data;
  },
  getPaymentsList: async () => {
    const res = await api.get("/jera/payment-list");
    return res.data;
  },
  getRatesList: async () => {
    const res = await api.get("/jera/rates");
    return res.data;
  },
  getInvoicesList: async () => {
    const res = await api.get("/zoho/customer-invoices");
    return res.data;
  },
};
