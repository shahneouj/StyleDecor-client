import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "./useAuth";

// Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

const useAxios = (method, baseUrl = "", config = {}, options = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const httpMethod = method.toLowerCase();

  const getAuthHeaders = async () => {
    if (!user) return {};
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  };

  // ===================== GET =====================
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

  // ================= MUTATION ====================
  return useMutation({
    mutationFn: async ({ url, data } = {}) => {
      const authHeaders = await getAuthHeaders();

      const res = await axiosInstance({
        method: httpMethod,
        url: url || baseUrl,
        data,
        headers: {
          "Content-Type": "application/json",
          ...(config.headers || {}),
          ...authHeaders,
        },
      });

      return res.data;
    },

    onSuccess: (...args) => {
      if (options.invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: options.invalidateQueries,
        });
      }
      options.onSuccess?.(...args);
    },

    ...options,
  });
};

export default useAxios;
