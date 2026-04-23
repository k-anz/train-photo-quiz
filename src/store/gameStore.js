// src/store/gameStore.js
import { create } from 'zustand'

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export const useGameStore = create((set, get) => ({
  questions: [],
  currentIndex: 0,
  openedPanels: new Set(),
  phase: 'playing', // 'playing' | 'correct' | 'wrong' | 'finished'
  score: 0,

  initGame: (questions) =>
    set({
      questions: shuffle(questions),
      currentIndex: 0,
      openedPanels: new Set(),
      phase: 'playing',
      score: 0,
    }),

  openPanel: (panelIndex) =>
    set((state) => {
      if (state.phase !== 'playing') return {}
      const next = new Set(state.openedPanels)
      next.add(panelIndex)
      return { openedPanels: next }
    }),

  submitAnswer: (choice) =>
    set((state) => {
      const current = state.questions[state.currentIndex]
      if (choice === current.answer) {
        return { phase: 'correct', score: state.score + 1 }
      }
      return { phase: 'wrong' }
    }),

  resumePlaying: () => set({ phase: 'playing' }),

  nextQuestion: () =>
    set((state) => {
      const nextIndex = state.currentIndex + 1
      if (nextIndex >= state.questions.length) {
        return { phase: 'finished' }
      }
      return {
        currentIndex: nextIndex,
        openedPanels: new Set(),
        phase: 'playing',
      }
    }),

  resetGame: () =>
    set((state) => ({
      questions: shuffle([...state.questions]),
      currentIndex: 0,
      openedPanels: new Set(),
      phase: 'playing',
      score: 0,
    })),
}))
