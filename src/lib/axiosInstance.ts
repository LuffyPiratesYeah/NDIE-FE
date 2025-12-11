import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터 - Firebase Auth에서 토큰 가져오기
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const auth = await getFirebaseAuth();
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.error("Failed to get auth token:", e);
    }
    return config;
  },
  (error: unknown): Promise<never> => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
