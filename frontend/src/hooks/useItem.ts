import { create } from 'zustand';
import { Item, ItemCreate } from '../types/models';
import { createItem as createItemApi, getItemsByRequerimiento } from '../api/item';

interface ItemState {
  items: Item[];
  selectedItem: Item | null;
  loading: boolean;
  error: string | null;
  createItem: (data: ItemCreate) => Promise<number>;
  getItemsByRequerimiento: (requerimientoId: number) => Promise<void>;
}

export const useItem = create<ItemState>((set) => ({
  items: [],
  selectedItem: null,
  loading: false,
  error: null,

  createItem: async (data: ItemCreate) => {
    set({ loading: true, error: null });
    try {
      const response = await createItemApi(data);
      set({ loading: false });
      return response.id;
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to create Item', loading: false });
      throw err;
    }
  },

  getItemsByRequerimiento: async (requerimientoId: number) => {
    set({ loading: true, error: null });
    try {
      const items = await getItemsByRequerimiento(requerimientoId);
      set({ items, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to get Items', loading: false });
    }
  },
}));
