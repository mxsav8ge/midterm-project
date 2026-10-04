import axios from 'axios';
import { Platform } from 'react-native';

// In Android Emulator, 10.0.2.2 maps directly to the host machine's localhost:8000
// On physical devices via Expo Go, the LAN IP is used.
const HOST_LAN_IP = '192.168.254.109';
const EMULATOR_HOST = '10.0.2.2';
const PORT = '8000';

const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return `http://localhost:${PORT}/api`;
  }
  if (Platform.OS === 'android') {
    // 10.0.2.2 reliably communicates with the host machine in Android Studio emulator
    return `http://${EMULATOR_HOST}:${PORT}/api`;
  }
  return `http://${HOST_LAN_IP}:${PORT}/api`;
};

export const BASE_API_URL = getBaseUrl();

const apiClient = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to ordering server.';
    console.warn(`[API Error] ${errorMsg}`);
    return Promise.reject(new Error(errorMsg));
  }
);

export default apiClient;
