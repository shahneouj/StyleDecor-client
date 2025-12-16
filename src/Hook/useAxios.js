import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "./useAuth";

// Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // optional (cookies / CORS)
});

const useAxios = (method, url, config = {}, options = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const httpMethod = method.toLowerCase();

  const getAuthHeaders = async () => {
    if (!user) return {};
    const token = await user.getIdToken(); // Firebase JWT
    return { Authorization: `Bearer ${token}` };
  };

  // ---------- GET ----------
  if (httpMethod === "get") {
    return useQuery({
      queryKey: [url, config],
      queryFn: async () => {
        const headers = await getAuthHeaders();
        const res = await axiosInstance.get(url, {
          ...config,
          headers: {
            ...(config.headers || {}),
            ...headers,
          },
        });
        return res.data;
      },
      ...options,
    });
  }

  // ---------- POST / PUT / DELETE ----------
  return useMutation({
    mutationFn: async (data) => {
      const headers = await getAuthHeaders();
      const res = await axiosInstance({
        method: httpMethod,
        url,
        data,
        headers,
      });
      return res.data;
    },
    onSuccess: (...args) => {
      if (options.invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: options.invalidateQueries });
      }
      options.onSuccess?.(...args);
    },
    ...options,
  });
};

export default useAxios;
