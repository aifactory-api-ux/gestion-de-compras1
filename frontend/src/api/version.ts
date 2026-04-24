import { VersionPAC } from '../types/models';
import apiClient from '../utils/apiClient';

export const getVersionesPAC = async (pacId: number): Promise<VersionPAC[]> => {
  const response = await apiClient.get<VersionPAC[]>(`/pac/${pacId}/versiones`);
  return response.data;
};
