import axios from "axios";

import { env } from "../config/env";

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10_000,
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
