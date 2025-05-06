import axios from "axios";
import { getSession } from "next-auth/react";
import { getCookie } from "cookies-next";
import { auth } from "@/auth";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL!;

const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const isServer = typeof window === "undefined";
  const session = isServer ? await auth() : await getSession();
  let organizationId;
  if (isServer) {
    const nextHeaders = require("next/headers");
    const cookies = await nextHeaders.cookies();
    organizationId = cookies.get("OrganizationId").value;
  } else {
    organizationId = getCookie("OrganizationId");
  }
  console.log("OrganizationId", isServer, organizationId);

  if (session?.user.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }

  if (organizationId) {
    config.headers["Organization"] = organizationId;
  }

  return config;
});

export default api;
