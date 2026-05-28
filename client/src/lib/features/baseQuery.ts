import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { showErrorToast, showSuccessToast } from "../utils/toasts";

const normalizeBaseUrl = (url: string | undefined) => {
  if (!url) return "";

  let v = url.trim().replace(/\/+$/, "");

  // If env is set to /api or /api/v1, endpoints already include /api/v1.
  if (/^\/?api(\/v\d+)?$/i.test(v)) {
    return "";
  }

  // If env is a full origin ending in /api or /api/v1, keep only the origin.
  v = v.replace(/\/api(\/v\d+)?$/i, "");
  return v;
};

const baseQuery = fetchBaseQuery({
  baseUrl: normalizeBaseUrl(import.meta.env.VITE_SERVER_URL),
  credentials: "include",
});

type CustomExtraOptions = {
  skipToast?: boolean;
};

interface SuccessResponse {
  message?: string;
  description?: string;
}

export const baseQueryWithToast: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  CustomExtraOptions
> = async (args, api, extraOptions) => {
  console.log("ARGS =>", args);
  const result = await baseQuery(args, api, extraOptions);
  const skipToast = extraOptions?.skipToast;

  if (result.error) {
    if (!skipToast) {
      showErrorToast(result.error);
    }
  } else {
    const data = result.data as SuccessResponse;

    if (!skipToast && data?.message) {
      showSuccessToast({
        message: data.message,
        description: data.description,
      });
    }
  }

  return result;
};
