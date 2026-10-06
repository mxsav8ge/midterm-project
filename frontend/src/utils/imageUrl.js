import { Platform } from 'react-native';

const LAN_IP = '192.168.0.116';
const PORT = '8000';

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return imageUrl;

  if (Platform.OS === 'android') {
    return imageUrl.replace(
      `http://localhost:${PORT}`,
      `http://${LAN_IP}:${PORT}`
    );
  }

  return imageUrl;
};