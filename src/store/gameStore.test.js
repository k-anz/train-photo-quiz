// src/store/gameStore.test.js
// @vitest-environment node
import { useGameStore } from './gameStore'

const mockQuestions = [
  { id: 1, imagePath: '/img/a.jpg', answer: '電車A', choices: ['電車A', '電車B', '電車C'] },
  { id: 2, imagePath: '/img/b.jpg', answer: '電車B', choices: ['電車A', '電車B', '電車C'] },
]

beforeEach(() => {
  useGameStore.setState({
    questions: [],
    currentIndex: 0,
    openedPanels: new Set(),
    phase: 'playing',
    score: 0,
    hasWrongedCurrentQuestion: false,
  })
})

describe('initGame', () => {
  it('問題をセットしてゲームを初期化する', () => {
    useGameStore.getState().initGame(mockQuestions)
    const state = useGameStore.getState()
    expect(state.questions).toHaveLength(2)
    expect(state.currentIndex).toBe(0)
    expect(state.openedPanels.size).toBe(0)
    expect(state.phase).toBe('playing')
    expect(state.score).toBe(0)
  })
})

describe('openPanel', () => {
  it('playing フェーズでパネルを開く', () => {
    useGameStore.setState({ phase: 'playing', openedPanels: new Set() })
    useGameStore.getState().openPanel(4)
    expect(useGameStore.getState().openedPanels.has(4)).toBe(true)
  })

  it('playing 以外のフェーズではパネルを開かない', () => {
    useGameStore.setState({ phase: 'correct', openedPanels: new Set() })
    useGameStore.getState().openPanel(4)
    expect(useGameStore.getState().openedPanels.size).toBe(0)
  })
})

describe('submitAnswer', () => {
  it('正解のとき phase が correct になりスコアが増える', () => {
    useGameStore.setState({ questions: mockQuestions, currentIndex: 0, score: 0, phase: 'playing' })
    useGameStore.getState().submitAnswer('電車A')
    const state = useGameStore.getState()
    expect(state.phase).toBe('correct')
    expect(state.score).toBe(1)
  })

  it('不正解のとき phase が wrong になりスコアは変わらない', () => {
    useGameStore.setState({ questions: mockQuestions, currentIndex: 0, score: 0, phase: 'playing' })
    useGameStore.getState().submitAnswer('電車B')
    const state = useGameStore.getState()
    expect(state.phase).toBe('wrong')
    expect(state.score).toBe(0)
  })

  it('不正解のときに hasWrongedCurrentQuestion が true になる', () => {
    useGameStore.setState({ questions: mockQuestions, currentIndex: 0, score: 0, phase: 'playing', hasWrongedCurrentQuestion: false })
    useGameStore.getState().submitAnswer('電車B')
    expect(useGameStore.getState().hasWrongedCurrentQuestion).toBe(true)
  })

  it('一度不正解した後に正解してもスコアは加算されない', () => {
    useGameStore.setState({ questions: mockQuestions, currentIndex: 0, score: 0, phase: 'playing', hasWrongedCurrentQuestion: false })
    useGameStore.getState().submitAnswer('電車B') // 不正解
    useGameStore.getState().resumePlaying()
    useGameStore.getState().submitAnswer('電車A') // 正解
    const state = useGameStore.getState()
    expect(state.phase).toBe('correct')
    expect(state.score).toBe(0)
  })
})

describe('resumePlaying', () => {
  it('phase を playing に戻す', () => {
    useGameStore.setState({ phase: 'wrong' })
    useGameStore.getState().resumePlaying()
    expect(useGameStore.getState().phase).toBe('playing')
  })
})

describe('nextQuestion', () => {
  it('次の問題に進む', () => {
    useGameStore.setState({ questions: mockQuestions, currentIndex: 0, openedPanels: new Set([1, 2]), phase: 'correct' })
    useGameStore.getState().nextQuestion()
    const state = useGameStore.getState()
    expect(state.currentIndex).toBe(1)
    expect(state.openedPanels.size).toBe(0)
    expect(state.phase).toBe('playing')
  })

  it('次の問題に進むときに hasWrongedCurrentQuestion がリセットされる', () => {
    useGameStore.setState({ questions: mockQuestions, currentIndex: 0, phase: 'correct', hasWrongedCurrentQuestion: true })
    useGameStore.getState().nextQuestion()
    expect(useGameStore.getState().hasWrongedCurrentQuestion).toBe(false)
  })

  it('最終問題の次は finished になる', () => {
    useGameStore.setState({ questions: mockQuestions, currentIndex: 1, phase: 'correct' })
    useGameStore.getState().nextQuestion()
    expect(useGameStore.getState().phase).toBe('finished')
  })
})

describe('resetGame', () => {
  it('スコアと進行をリセットし問題をシャッフルして再開する', () => {
    useGameStore.setState({ questions: mockQuestions, currentIndex: 1, score: 2, phase: 'finished', openedPanels: new Set([0, 1, 2]), hasWrongedCurrentQuestion: true })
    useGameStore.getState().resetGame()
    const state = useGameStore.getState()
    expect(state.currentIndex).toBe(0)
    expect(state.score).toBe(0)
    expect(state.phase).toBe('playing')
    expect(state.openedPanels.size).toBe(0)
    expect(state.questions).toHaveLength(2)
    expect(state.hasWrongedCurrentQuestion).toBe(false)
  })
})
