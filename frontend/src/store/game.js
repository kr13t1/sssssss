import { create } from 'zustand';

export const useData = create((set) => ({
  data: [
    { id: 41, size: 4, position: [] },
    { id: 31, size: 3, position: [] },
    { id: 32, size: 3, position: [] },
    { id: 21, size: 2, position: [] },
    { id: 22, size: 2, position: [] },
    { id: 23, size: 2, position: [] },
    { id: 11, size: 1, position: [] },
    { id: 12, size: 1, position: [] },
    { id: 13, size: 1, position: [] },
    { id: 14, size: 1, position: [] },
  ],
  setData: (state) => set(() => ({ data: state })),
  updateShipPosition: (shipId, newPosition) =>
    set((state) => ({
      data: state.data.map((ship) =>
        ship.id === shipId ? { ...ship, position: newPosition } : ship,
      ),
    })),
}));
