import axios from "axios";
import * as Sentry from "@sentry/nextjs";
import { getCookie } from "cookies-next";
import { clientSignout } from "@/lib/auth";
import { defaultLocale } from "@/i18n/config";
import { getTimezone } from "@/lib/meta";
import { apiLogger } from "@/lib/logger";
import useSessionStore from "@/store/session.slice";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL!;

const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    "is-new": true,
  },
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const { session } = useSessionStore.getState();
  const organizationId =
    (await getCookie("OrganizationId")) || session?.organizations?.[0]?.id;
  const ip = await getCookie("ip");
  const timezone = getTimezone();
  const lang = localStorage.getItem("app-locale") || defaultLocale;

  if (session?.accessToken)
    config.headers.Authorization = `Bearer ${session?.accessToken}`;

  if (session?.userType) config.headers["x-user-type"] = session?.userType;

  if (organizationId) config.headers["Organization"] = organizationId;

  if (lang) config.headers["Accept-Language"] = lang;

  if (ip) config.headers["X-Client-IP"] = ip;

  config.headers["timezone"] = timezone;

  Sentry.addBreadcrumb({
    category: "api.request",
    message: `${config.method?.toUpperCase()} ${config.url}`,
    level: "info",
    data: { url: config.url, method: config.method, organizationId },
  });

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    apiLogger.error("API Error:", error);
    if (error.response) {
      const { status, config: reqConfig } = error.response;
      Sentry.captureException(error, {
        tags: { component: "api", status },
        extra: {
          url: reqConfig?.url,
          method: reqConfig?.method,
          status,
          statusText: error.response.statusText,
        },
      });
      if (status === 401 && process.env.NODE_ENV === "production") {
        apiLogger.info("Unauthorized! Logging out...");
        await clientSignout();
      }
    } else if (error.request) {
      apiLogger.error("Network error - please check your connection");
      Sentry.captureException(error, {
        tags: { component: "api", type: "network" },
        extra: { url: error.config?.url, method: error.config?.method },
      });
    } else {
      apiLogger.error("Error:", error.message);
      Sentry.captureException(error, { tags: { component: "api" } });
    }
    return Promise.reject(error);
  },
);

export default api;
