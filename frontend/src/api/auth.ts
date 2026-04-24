import { TokenResponse } from '../types/models';
import { authClient } from '../utils/apiClient';

export const login = async (email: string, password: string): Promise<TokenResponse> => {
  const response = await authClient.post<TokenResponse>('/auth/login', { email, password });
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('access_token');
};
