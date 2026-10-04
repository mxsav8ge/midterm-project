import apiClient from '../client';

export const menuService = {
  getCategories: async () => {
    const res = await apiClient.get('/categories');
    return res.data;
  },

  getMenuItems: async (category = null) => {
    const params = category && category !== 'all' ? { category } : {};
    const res = await apiClient.get('/menu', { params });
    return res.data;
  },

  getMenuItemById: async (id) => {
    const res = await apiClient.get(`/menu/${id}`);
    return res.data;
  },
};
