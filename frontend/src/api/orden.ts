import { OrdenCompra } from '../types/models';
import apiClient from '../utils/apiClient';

export const getOrdenesPAC = async (pacId: number): Promise<OrdenCompra[]> => {
  const response = await apiClient.get<OrdenCompra[]>(`/pac/${pacId}/ordenes`);
  return response.data;
};
