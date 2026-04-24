import { create } from 'zustand';
import { PAC, PACCreate, PACPublicarRequest, PACPublicarResponse } from '../types/models';
import { createPAC as createPACApi, getPAC as getPACApi, getAllPAC, publicarPAC as publicarPACApi } from '../api/pac';

interface PACState {
  pacs: PAC[];
  selectedPAC: PAC | null;
  loading: boolean;
  error: string | null;
  createPAC: (data: PACCreate) => Promise<number>;
  getPAC: (id: number) => Promise<void>;
  getAllPAC: () => Promise<void>;
  publicarPAC: (data: PACPublicarRequest) => Promise<PACPublicarResponse>;
}

export const usePAC = create<PACState>((set) => ({
  pacs: [],
  selectedPAC: null,
  loading: false,
  error: null,

  createPAC: async (data: PACCreate) => {
    set({ loading: true, error: null });
    try {
      const response = await createPACApi(data);
      set({ loading: false });
      return response.id;
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to create PAC', loading: false });
      throw err;
    }
  },

  getPAC: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const pac = await getPACApi(id);
      set({ selectedPAC: pac, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to get PAC', loading: false });
    }
  },

  getAllPAC: async () => {
    set({ loading: true, error: null });
    try {
      const pacs = await getAllPAC();
      set({ pacs, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to get PACs', loading: false });
    }
  },

  publicarPAC: async (data: PACPublicarRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await publicarPACApi(data);
      set({ loading: false });
      return response;
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to publish PAC', loading: false });
      throw err;
    }
  },
}));
