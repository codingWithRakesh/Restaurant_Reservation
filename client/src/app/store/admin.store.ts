import { createStore } from 'zustand/vanilla';
import { api, errMsg } from '../core/api';
import { Restaurant } from '../core/models';
import { authStore } from './auth.store';
import { catalogStore } from './catalog.store';

interface AdminState {
  busy: boolean;
  error: string | null;
  clearError: () => void;
  updateProfile: (fd: FormData) => Promise<boolean>;
  addFood: (fd: FormData) => Promise<boolean>;
  addTable: (fd: FormData) => Promise<boolean>;
  deleteFood: (id: string) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
}

export const adminStore = createStore<AdminState>()((set, get) => {
  /** Runs an API call, tracks busy/error, returns true on success. */
  const run = async (fn: () => Promise<unknown>) => {
    set({ busy: true, error: null });
    try { await fn(); set({ busy: false }); return true; }
    catch (e) { set({ busy: false, error: errMsg(e) }); return false; }
  };

  return {
    busy: false,
    error: null,
    clearError: () => set({ error: null }),

    updateProfile: fd => run(async () => {
      const r = await api<Restaurant>('/restaurant/addDetails', { method: 'POST', body: fd });
      authStore.getState().setAccount(r);
    }),

    addFood: fd => run(async () => {
      await api('/food/create', { method: 'POST', body: fd });
      await catalogStore.getState().fetchFoods();
    }),

    addTable: fd => run(async () => {
      await api('/table/create', { method: 'POST', body: fd });
      await catalogStore.getState().fetchTables();
    }),

    deleteFood: async id => {
      await run(async () => {
        await api(`/food/delete/${id}`, { method: 'DELETE' });
        await catalogStore.getState().fetchFoods();
      });
    },

    deleteTable: async id => {
      await run(async () => {
        await api(`/table/delete/${id}`, { method: 'DELETE' });
        await catalogStore.getState().fetchTables();
      });
    },
  };
});
