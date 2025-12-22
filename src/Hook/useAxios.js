import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "./useAuth";

const axiosInstance = axios.create({
  baseURL: "https://styledecorserver.vercel.app",
  withCredentials: true,
});

const useAxios = (method, baseUrl = "", config = {}, options = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const httpMethod = method.toLowerCase();

  const getAuthHeaders = async () => {
    if (!user) return {};
    try {
      const token = await user.getIdToken();
      return { Authorization: `Bearer ${token}` };
    } catch (error) {
      console.error("Failed to get ID token:", error);
      return {};
    }
  };

  // ========== GET (useQuery) ==========
  if (httpMethod === "get") {
    return useQuery({
      queryKey: [baseUrl, config],
      queryFn: async () => {
        const authHeaders = await getAuthHeaders();
        const res = await axiosInstance.get(baseUrl, {
          ...config,
          headers: {
            ...(config.headers || {}),
            ...authHeaders,
          },
        });
        return res.data;
      },
      ...options,
    });
  }

  // ========== MUTATIONS (post, patch, delete, etc.) ==========
  return useMutation({
    mutationFn: async (dataOrParams) => {
      const authHeaders = await getAuthHeaders();

      // Handle different parameter formats:
      let url = baseUrl;
      let data = dataOrParams;

      // If it's an object with 'url' property, treat as { url, data } format
      if (dataOrParams && typeof dataOrParams === 'object' && 'url' in dataOrParams) {
        url = dataOrParams.url || baseUrl;
        data = dataOrParams.data;
      }

      console.log("Sending request:", { method: httpMethod, url, data }); // Debug log

      const res = await axiosInstance({
        method: httpMethod,
        url,
        data,
        headers: {
          "Content-Type": "application/json",
          ...(config.headers || {}),
          ...authHeaders,
        },
      });
      return res.data;
    },
    onSuccess: (data, variables, context) => {
      if (options.invalidateQueries) {
        if (Array.isArray(options.invalidateQueries)) {
          options.invalidateQueries.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: typeof key === "string" ? [key] : key });
          });
        } else if (typeof options.invalidateQueries === "string") {
          queryClient.invalidateQueries({ queryKey: [options.invalidateQueries] });
        }
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error("Mutation error:", error);
      options.onError?.(error, variables, context);
    },
    ...options,
  });
};



export default useAxios;