import { create } from 'zustand';

// TODO: не работает, переписать setData.
export const useData = create((set) => ({
  data: [
    { id: 'ship1', size: 4, position: [] },
    { id: 'ship2', size: 4, position: [] },
    { id: 'ship3', size: 3, position: [] },
    { id: 'ship4', size: 3, position: [] },
    { id: 'ship5', size: 3, position: [] },
    { id: 'ship6', size: 2, position: [] },
    { id: 'ship7', size: 2, position: [] },
    { id: 'ship8', size: 2, position: [] },
    { id: 'ship9', size: 1, position: [] },
    { id: 'ship10', size: 1, position: [] },
    { id: 'ship11', size: 1, position: [] },
    { id: 'ship12', size: 1, position: [] },
  ],
  setData: (dt) => set(() => ({ data: dt })),
}));
