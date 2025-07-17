import useSnackbar from '@/composables/useSnackbar';
import { router } from '@/plugins/1.router';
import axios from 'axios';

const { trigger } = useSnackbar();

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add any other custom headers here
    return config;
  },
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can handle response transformations here
    return response;
  },
  async (error) => {
    const { response } = error;
    trigger(response.data.error || 'Something when wrong.', "error");
    if (response) {
      const { status, data } = response;

      // Handle specific status codes
      switch (status) {
        case 401:
          console.warn('Unauthorized - maybe token expired');
          // ::::::::::::::::::::::::::::::::::::::::::::::::: PUSH TO LOGIN SCREEN
          router.push("/login");
          break;

        case 403:
          console.warn('Forbidden - you do not have access');
          // ::::::::::::::::::::::::::::::::::::::::::::::::: PUSH TO LOGIN SCREEN
          router.push("/login");
          break;

        case 404:
          console.warn('Not Found:', data.message || 'Endpoint not found');
          break;

        case 500:
          console.error('Internal Server Error');
          break;

        default:
          console.warn(`Unhandled status ${status}:`, data);
          break;
      }
    } else {
      // Network or CORS errors
      console.error('[Network Error]', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
