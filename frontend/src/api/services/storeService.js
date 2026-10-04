import apiClient from '../client';

export const storeService = {
  getStoreInfo: async () => {
    const res = await apiClient.get('/store-info');
    return res.data;
  },

  getPromotions: async () => {
    const res = await apiClient.get('/promotions');
    return res.data;
  },
};
