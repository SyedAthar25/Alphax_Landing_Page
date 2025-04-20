/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";
import AxiosFetcher from "./AxiosFetcher";
import { VITE_LAMBDA_URL } from "@constants/index";

// VITE_BE_DOMAIN,

// ENDPOINTS keys
export const ENDPOINTS = {
  // Auth
  login: "https://test.neotechis.com/api/method/alphax_erp.api.login.login", // Login 
  logout: "https://test.neotechis.com/api/method/alphax_erp.api.login.logout_user",
  // signup: "http://test.neotec.ai/api/method/alphax_erp.api.auth.signup_and_get_token",
  // createSite: "http://test.neotec.ai/api/method/alphax_erp.api.utils.create_new_site",
  signup: "https://test.neotechis.com/api/method/alphax_erp.api.auth.signup_and_get_token",
  createSite: "https://test.neotechis.com/api/method/alphax_erp.api.utils.create_new_site",
  // checkUserInputAvailability: "https://test.neotechis.com/api/method/alphax_erp.api.validate_user_input.validate_user_input",
  validateFirstName: "https://test.neotechis.com/api/method/alphax_erp.api.validate_user_input.validate_first_name",
  validateEmail: "https://test.neotechis.com/api/method/alphax_erp.api.validate_user_input.validate_email",
  validateSiteName: "https://test.neotechis.com/api/method/alphax_erp.api.validate_user_input.validate_site_name",

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
