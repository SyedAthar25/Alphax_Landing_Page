/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";
import AxiosFetcher from "./AxiosFetcher";
import {  VITE_LAMBDA_URL } from "@constants/index";
// VITE_BE_DOMAIN,

// ENDPOINTS keys
export const ENDPOINTS = {
  // Auth
  login: "/auth/login",
  // signup: "http://test.neotec.ai/api/method/vertex_erp.api.auth.signup_and_get_token",
  // createSite: "http://test.neotec.ai/api/method/vertex_erp.api.utils.create_new_site",
  signup: "http://test.neotechis.com/api/method/vertex_erp.api.auth.signup_and_get_token",
  createSite: "http://test.neotechis.com/api/method/vertex_erp.api.utils.create_new_site",

  // Optional
  configSite: "/server/config-site",
  registerTrial: "/user/trial",
  registerPremium: "/user/premium",
};

// Axios instances
export const fetcher = new AxiosFetcher(import.meta.env.VITE_BE_DOMAIN);
export const serverFetcher = new AxiosFetcher(VITE_LAMBDA_URL);

// SWR config
const SWRoptions = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
  loadingTimeout: 3000,
};

// Hook
const useAxiosSWR = <Data, Error = any>(
  url: string,
  options?: Record<string, any>
) => {
  const { data, error, mutate } = useSWR<Data, Error>(
    [url, options],
    () => fetcher.get(url, options),
    {
      ...SWRoptions,
      ...options?.forSWR,
      refreshInterval: options?.refreshInterval || 0,
    }
  );

  return {
    data,
    error,
    isLoading: !error && !data,
    mutate,
  };
};

export default useAxiosSWR;
