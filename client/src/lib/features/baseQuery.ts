import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { showErrorToast, showSuccessToast } from "../utils/toasts";

const normalizeBaseUrl = (url: string | undefined) => {
  if (!url) return "/api/v1";
  let v = url.trim().replace(/\/+$/, "");
  // remove trailing /api or /api/v1 if user mistakenly included it
  v = v.replace(/\/api(\/v\d+)?$/i, "");
  return v || "/api/v1";
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
