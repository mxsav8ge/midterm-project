import apiClient from '../client';

export const orderService = {
  createOrder: async (orderPayload) => {
    const res = await apiClient.post('/orders', orderPayload);
    return res.data;
  },
};
