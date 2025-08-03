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
    "is-new": true,
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
    organizationId = cookies.get("OrganizationId")?.value;
  } else {
    organizationId = await getCookie("OrganizationId");
  }

  let lang = "en";
  if (isServer) {
    const nextHeaders = require("next/headers");
    const headers = await nextHeaders.headers();
    lang = headers.get("NEXT_LOCALE") || "en";
  } else {
    lang = (await getCookie("NEXT_LOCALE")) || "en";
  }

  if (session?.user.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }

  if (session?.user.userType) {
    config.headers["x-user-type"] = session.user.userType;
  }

  if (organizationId) {
    config.headers["Organization"] = organizationId;
  }

  if (lang) {
    config.headers["Accept-Language"] = lang;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error responses
      if (error.response.status === 401) {
        // Handle unauthorized access, e.g., redirect to login
        console.error("Unauthorized access - redirecting to login");
        if (typeof window !== "undefined") {
          window.location.href = "/login"; // Redirect to login page
        }
      } else if (error.response.status === 403) {
        // Handle forbidden access
        console.error(
          "Forbidden access - you do not have permission to view this resource"
        );
      } else if (error.response.status === 404) {
        // Handle not found errors
        console.error("Resource not found");
      } else if (error.response.status === 500) {
        // Handle internal server errors
        console.error("Internal server error - please try again later");
      } else {
        // Handle other error responses
        console.error(
          `Error: ${error.response.status} - ${
            error.response.data.message || "An error occurred"
          }`
        );
      }
    } else if (error.request) {
      // Handle network errors
      console.error("Network error - please check your connection");
    } else {
      // Handle other errors
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
