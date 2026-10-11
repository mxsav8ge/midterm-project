import { Platform } from 'react-native';
import { SERVER_URL } from '../config/server';

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return imageUrl;

  if (Platform.OS === 'android') {
    return imageUrl.replace(
      'http://localhost:8000',
      SERVER_URL
    );
  }

  return imageUrl;
};