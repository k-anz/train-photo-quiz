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

function assignChoices(questions, choicesPerQuestion = 3) {
  const allAnswers = questions.map((q) => q.answer)
  return questions.map((q) => {
    const wrong = shuffle(allAnswers.filter((a) => a !== q.answer)).slice(0, choicesPerQuestion - 1)
    return { ...q, choices: shuffle([q.answer, ...wrong]) }
  })
}

export const useGameStore = create((set) => ({
  questions: [],
  currentIndex: 0,
  openedPanels: new Set(),
  phase: 'playing', // 'playing' | 'correct' | 'wrong' | 'finished'
  score: 0,
  hasWrongedCurrentQuestion: false,

  initGame: (questions) =>
    set({
      questions: assignChoices(shuffle(questions)),
      currentIndex: 0,
      openedPanels: new Set(),
      phase: 'playing',
      score: 0,
      hasWrongedCurrentQuestion: false,
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
        const scoreDelta = state.hasWrongedCurrentQuestion ? 0 : 1
        return { phase: 'correct', score: state.score + scoreDelta }
      }
      return { phase: 'wrong', hasWrongedCurrentQuestion: true }
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
        hasWrongedCurrentQuestion: false,
      }
    }),

  resetGame: () =>
    set((state) => ({
      questions: assignChoices(shuffle([...state.questions])),
      currentIndex: 0,
      openedPanels: new Set(),
      phase: 'playing',
      score: 0,
      hasWrongedCurrentQuestion: false,
    })),
}))
