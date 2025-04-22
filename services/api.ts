import axios from "axios";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL!;

const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
