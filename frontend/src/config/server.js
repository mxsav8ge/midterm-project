import { Platform } from 'react-native';

const PORT = '8000';

const getServerHost = () => {
  if (Platform.OS === 'web') {
    return 'localhost';
  }

  return '192.168.0.100';
};

export const SERVER_HOST = getServerHost();
export const SERVER_PORT = PORT;
export const SERVER_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;