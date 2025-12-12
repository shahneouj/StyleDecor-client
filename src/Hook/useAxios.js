import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

/**
 * @param {string} method - HTTP method
 * @param {string} url - API endpoint URL
 * @param {object} config - Axios config for GET (optional)
 * @param {object} options - React Query options
 * @param {() => Promise<string>} getToken - async function to get Firebase ID token (optional)
 */
export const useAxios = (method, url, config = {}, options = {}, getToken) => {
  const queryClient = useQueryClient();
  const httpMethod = method.toLowerCase();

  const authHeaders = async () => {
    if (!getToken) return {};
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  if (httpMethod === "get") {
    const fetchData = async () => {
      const headers = await authHeaders();
      const response = await axios.get(url, {
        ...config,
        headers: {
          ...(config.headers || {}),
          ...headers,
        },
      });
      return response.data;
    };
    return useQuery([url, config], fetchData, options);
  } else {
    const mutateFn = async (data) => {
      const headers = await authHeaders();
      const response = await axios({
        method: httpMethod,
        url,
        data,
        headers,
      });
      return response.data;
    };

    return useMutation(mutateFn, {
      ...options,
      onSuccess: (...args) => {
        if (options.invalidateQueries) {
          queryClient.invalidateQueries(options.invalidateQueries);
        }
        if (options.onSuccess) {
          options.onSuccess(...args);
        }
      },
    });
  }
};
