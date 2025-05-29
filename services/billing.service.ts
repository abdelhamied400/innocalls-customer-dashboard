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
  getPaymentsList: async (
    pageIndex: number,
    pageSize: number,
    filters: Object
  ) => {
    const queryString = objToQueryString(filters);
    const res = await api.get(
      `/jera/payment-list?itemsPerPage=${pageSize}&page=${pageIndex}&${queryString}`
    );
    return res.data;
  },
  getRatesList: async (
    pageIndex: number,
    pageSize: number,
    filters: Object
  ) => {
    const queryString = objToQueryString(filters);
    const res = await api.get(
      `/jera/rates?itemsPerPage=${pageSize}&page=${pageIndex}&${queryString}`
    );
    return res.data;
  },
  getInvoicesList: async (
    pageIndex: number,
    pageSize: number,
    filters: Object
  ) => {
    const queryString = objToQueryString(filters);
    const res = await api.get(
      `/zoho/customer-invoices?itemsPerPage=${pageSize}&page=${pageIndex}&${queryString}`
    );
    return res.data;
  },
  createStripeIntent: async (amount: number) => {
    const res = await api.post(`jera/payment/stripe/create-intent`, {
      amount,
    });
    return res.data;
  },
};
