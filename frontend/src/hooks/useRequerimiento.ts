import { create } from 'zustand';
import { Requerimiento, RequerimientoCreate } from '../types/models';
import { createRequerimiento as createReqApi, getRequerimientosByPAC } from '../api/requerimiento';

interface RequerimientoState {
  requerimientos: Requerimiento[];
  selectedRequerimiento: Requerimiento | null;
  loading: boolean;
  error: string | null;
  createRequerimiento: (data: RequerimientoCreate) => Promise<number>;
  getRequerimientosByPAC: (pacId: number) => Promise<void>;
}

export const useRequerimiento = create<RequerimientoState>((set) => ({
  requerimientos: [],
  selectedRequerimiento: null,
  loading: false,
  error: null,

  createRequerimiento: async (data: RequerimientoCreate) => {
    set({ loading: true, error: null });
    try {
      const response = await createReqApi(data);
      set({ loading: false });
      return response.id;
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to create Requerimiento', loading: false });
      throw err;
    }
  },

  getRequerimientosByPAC: async (pacId: number) => {
    set({ loading: true, error: null });
    try {
      const requerimientos = await getRequerimientosByPAC(pacId);
      set({ requerimientos, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to get Requerimientos', loading: false });
    }
  },
}));
