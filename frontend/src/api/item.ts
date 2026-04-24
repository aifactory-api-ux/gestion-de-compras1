import { Item, ItemCreate } from '../types/models';
import apiClient from '../utils/apiClient';

export const createItem = async (data: ItemCreate): Promise<{ id: number }> => {
  const response = await apiClient.post<{ id: number }>('/item', data);
  return response.data;
};

export const getItem = async (id: number): Promise<Item> => {
  const response = await apiClient.get<Item>(`/item/${id}`);
  return response.data;
};

export const getItemsByRequerimiento = async (requerimientoId: number): Promise<Item[]> => {
  const response = await apiClient.get<Item[]>('/item', {
    params: { requerimiento_id: requerimientoId },
  });
  return response.data;
};
