import { create } from 'zustand';
import { OrdenCompra } from '../types/models';
import { getOrdenesPAC } from '../api/orden';

interface OrdenState {
  ordenes: OrdenCompra[];
  loading: boolean;
  error: string | null;
  getOrdenesByPAC: (pacId: number) => Promise<void>;
}

export const useOrden = create<OrdenState>((set) => ({
  ordenes: [],
  loading: false,
  error: null,

  getOrdenesByPAC: async (pacId: number) => {
    set({ loading: true, error: null });
    try {
      const ordenes = await getOrdenesPAC(pacId);
      set({ ordenes, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to get Ordenes', loading: false });
    }
  },
}));
