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
    if (error.response?.status === 401) {
      localStorage.removeItem("token");  
      window.location.href = '/login';
      alert("Session has expired. Please log in again.");
    } else if (error.response?.status === 403) {
      alert("You do not have permission to perform this action.");
    }
    return Promise.reject(error);
  }
);

// Define the API service methods
const apiService = {
  get: (url, params) => apiClient.get(url, { params }),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  patch: (url, data) => apiClient.patch(url, data),
  delete: (url) => apiClient.delete(url),
};

export default apiService;
