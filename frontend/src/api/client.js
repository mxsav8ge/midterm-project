import axios from 'axios';  
import Constants from 'expo-constants';
import { SERVER_URL } from '../config/server';


console.log('Expo host URI:', Constants.expoConfig?.hostUri);
console.log('Expo linking URI:', Constants.linkingUri);


const getBaseUrl = () => {
  return `${SERVER_URL}/api`;
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
