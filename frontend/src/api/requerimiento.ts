import { Requerimiento, RequerimientoCreate } from '../types/models';
import apiClient from '../utils/apiClient';

export const createRequerimiento = async (data: RequerimientoCreate): Promise<{ id: number }> => {
  const response = await apiClient.post<{ id: number }>('/requerimiento', data);
  return response.data;
};

export const getRequerimiento = async (id: number): Promise<Requerimiento> => {
  const response = await apiClient.get<Requerimiento>(`/requerimiento/${id}`);
  return response.data;
};

export const getRequerimientosByPAC = async (pacId: number): Promise<Requerimiento[]> => {
  const response = await apiClient.get<Requerimiento[]>('/requerimiento', {
    params: { pac_id: pacId },
  });
  return response.data;
};
