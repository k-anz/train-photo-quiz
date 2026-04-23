// src/components/ResultOverlay.jsx
import { useEffect } from 'react'

export function ResultOverlay({ phase, onNext, onResumePlaying }) {
  useEffect(() => {
    if (phase !== 'wrong') return
    const timer = setTimeout(onResumePlaying, 1500)
    return () => clearTimeout(timer)
  }, [phase, onResumePlaying])

  if (phase === 'correct') {
    return (
      <div className="overlay overlay--correct">
        <p className="overlay__text">✓ 正解！</p>
        <button className="btn--primary" onClick={onNext}>
          次の問題へ →
        </button>
      </div>
    )
  }

  if (phase === 'wrong') {
    return (
      <div className="toast" role="alert">
        ✗ 残念！もう少しヒントを開いてみよう
      </div>
    )
  }

  return null
}
