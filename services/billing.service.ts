import { objToQueryString } from "@/lib/utils";
import api from "./api";
import { SortingState } from "@tanstack/react-table";

export default {
  getChargesList: async (
    pageIndex: number,
    pageSize: number,
    filters: object
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
    filters: object
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
    filters: object
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
    filters: object,
    sorting: SortingState
  ) => {
    const queryString = objToQueryString(filters);
    const sortingString = sorting
      .map((sort) => `sortBy=${sort.id}&sortOrder=${sort.desc ? "D" : "A"}`)
      .join("&");
    const res = await api.get(
      `/zoho/customer-invoices?itemsPerPage=${pageSize}&page=${pageIndex}&${queryString}&${sortingString}`
    );
    return res.data;
  },
  getInvoiceUrl: async (invoiceId: string) => {
    const res = await api.get(`zoho/invoice-url/${invoiceId}`);
    return res.data;
  },
  getInvoiceFileUrl: async (invoiceId: string) => {
    const res = await api.get(`zoho/invoice-url/${invoiceId}`);
    const invoiceUrl = new URL(res.data);
    const invoiceID = invoiceUrl.searchParams.get("CInvoiceID");
    const url = new URL(
      `https://zohosecurepay.com/billing/innocallsksa/api/v1/clientinvoices/secure?CInvoiceID=${invoiceID}&accept=pdf`
    );
    return url;
  },
  createStripeIntent: async (amount: number) => {
    const res = await api.post(`jera/payment/stripe/create-intent`, {
      amount,
    });
    return res.data;
  },
  getPaymentReference: async (amount: number) => {
    const res = await api.post(`/v1/payments/intent`, {
      amount,
    });
    return res.data;
  },
};
