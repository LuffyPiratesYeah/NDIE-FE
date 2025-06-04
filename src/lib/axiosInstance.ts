import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://ndie-be-985895714915.europe-west1.run.app/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const refreshAccessToken = async (): Promise<string | false> => {
  try {
    const AT = localStorage.getItem('AT');

    const response: AxiosResponse = await axios.get('/api/reissue', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AT}`,
      },
      withCredentials: true,
    });

    if (response.status !== 200) {
      localStorage.removeItem('AT');
      window.location.href = '/';
      return false;
    }

    return response.headers['authorization'];
  } catch (error : unknown) {
    localStorage.removeItem('AT');
    window.location.href = '/';
    return false;
  }
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('AT');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown): Promise<never> => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse | undefined> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAT = await refreshAccessToken();

        if (newAT) {
          localStorage.setItem('AT', newAT);
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAT}`;
          }
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token expired or invalid", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;