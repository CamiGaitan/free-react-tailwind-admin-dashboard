import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/";
const normalizedApiBaseUrl = apiBaseUrl.endsWith("/")
  ? apiBaseUrl
  : `${apiBaseUrl}/`;

const isAuthEndpoint = (url?: string) => {
  if (!url) return false;
  return url.includes("auth/login/") || url.includes("auth/refresh/");
};

const api = axios.create({
  baseURL: normalizedApiBaseUrl,
});

api.interceptors.request.use((config) => {
  if (isAuthEndpoint(config.url)) {
    return config;
  }

  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (isAuthEndpoint(originalRequest?.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        window.location.href = "/signin";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${normalizedApiBaseUrl}auth/refresh/`, {
          refresh,
        });

        const newAccess = response.data.access;
        localStorage.setItem("access", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/signin";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;