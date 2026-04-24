import { PAC, PACCreate, PACPublicarRequest, PACPublicarResponse } from '../types/models';
import apiClient from '../utils/apiClient';

export const createPAC = async (data: PACCreate): Promise<{ id: number }> => {
  const response = await apiClient.post<{ id: number }>('/pac', data);
  return response.data;
};

export const getPAC = async (id: number): Promise<PAC> => {
  const response = await apiClient.get<PAC>(`/pac/${id}`);
  return response.data;
};

export const getAllPAC = async (): Promise<PAC[]> => {
  const response = await apiClient.get<PAC[]>('/pac');
  return response.data;
};

export const publicarPAC = async (data: PACPublicarRequest): Promise<PACPublicarResponse> => {
  const response = await apiClient.put<PACPublicarResponse>('/pac/publicar', data);
  return response.data;
};
