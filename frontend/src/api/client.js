import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

console.log('Expo host URI:', Constants.expoConfig?.hostUri);
console.log('Expo linking URI:', Constants.linkingUri);

const HOST_LAN_IP = '192.168.0.116';
const PORT = '8000';

const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return `http://localhost:${PORT}/api`;
  }
if (Platform.OS === 'android') {
  return `http://${HOST_LAN_IP}:${PORT}/api`;
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
