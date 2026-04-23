// src/App.jsx
import { useEffect } from 'react'
import { useGameStore } from './store/gameStore'
import { Header } from './components/Header'
import { PanelGrid } from './components/PanelGrid'
import { Choices } from './components/Choices'
import { ResultOverlay } from './components/ResultOverlay'
import { FinalScore } from './components/FinalScore'
import questionsData from './data/questions.json'

function playSound(filename) {
  const audio = new Audio(`${import.meta.env.BASE_URL}sounds/${filename}`)
  audio.play().catch(() => {
    // ブラウザの自動再生ポリシーで再生できない場合は無視する
  })
}

export default function App() {
  const {
    questions,
    currentIndex,
    openedPanels,
    phase,
    score,
    initGame,
    openPanel,
    submitAnswer,
    resumePlaying,
    nextQuestion,
    resetGame,
  } = useGameStore()

  useEffect(() => {
    initGame(questionsData)
  }, [initGame])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (choice) => {
    const isCorrect = choice === currentQuestion.answer
    submitAnswer(choice)
    playSound(isCorrect ? 'correct.mp3' : 'wrong.mp3')
  }

  if (phase === 'finished') {
    return (
      <FinalScore
        score={score}
        total={questions.length}
        onRetry={resetGame}
      />
    )
  }

  if (!currentQuestion) return null

  return (
    <div className="app">
      <Header
        current={currentIndex + 1}
        total={questions.length}
        score={score}
      />
      <main style={{ position: 'relative' }}>
        <PanelGrid
          imagePath={currentQuestion.imagePath}
          openedPanels={openedPanels}
          onOpenPanel={openPanel}
          phase={phase}
        />
        <ResultOverlay
          phase={phase}
          onNext={nextQuestion}
          onResumePlaying={resumePlaying}
        />
      </main>
      <Choices
        choices={currentQuestion.choices}
        onSelect={handleAnswer}
        phase={phase}
      />
    </div>
  )
}
