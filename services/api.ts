import axios from "axios";
import { getSession } from "next-auth/react";
import { getCookie } from "cookies-next/client";
import { auth } from "@/auth";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL!;

const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const isServer = typeof window === "undefined";
  const session = isServer ? await auth() : await getSession();
  const organizationId = getCookie("OrganizationId");

  if (session?.user.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }

  if (organizationId) {
    config.headers["Organization"] = organizationId;
  }

  return config;
});

export default api;
