import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.12.113:3000",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      alert("Your session has expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);

const apiService = {
  get: (url, params) => apiClient.get(url, params),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  patch: (url, data) => apiClient.patch(url, data),
  delete: (url) => apiClient.delete(url),
};

export default apiService;
