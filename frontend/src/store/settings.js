import { create } from 'zustand';

export const useTime = create((set) => ({
  time: null,
  setTime: (state) => set(() => ({ time: state })),
}));

export const useMarks = create((set) => ({
  marks: true,
  setMarks: (state) => set(() => ({ marks: state })),
}));

export const useDifficulty = create((set) => ({
  diff: 'high',
  setDiff: (state) => set(() => ({ diff: state })),
}));
