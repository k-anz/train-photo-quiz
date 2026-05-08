// src/components/ResultOverlay.jsx
import { useEffect, useState } from 'react'

export function ResultOverlay({ phase, onNext, onResumePlaying }) {
  const [overlayFaded, setOverlayFaded] = useState(false)

  useEffect(() => {
    if (phase !== 'wrong') return
    const timer = setTimeout(onResumePlaying, 1500)
    return () => clearTimeout(timer)
  }, [phase, onResumePlaying])

  useEffect(() => {
    if (phase !== 'correct') {
      setOverlayFaded(false)
      return
    }
    setOverlayFaded(false)
    const timer = setTimeout(() => setOverlayFaded(true), 1500)
    return () => clearTimeout(timer)
  }, [phase])

  if (phase === 'correct') {
    return (
      <div
        className={`overlay overlay--correct${overlayFaded ? ' overlay--faded' : ''}`}
        onClick={onNext}
      >
        {!overlayFaded && <p className="overlay__text">✓ 正解！</p>}
        {overlayFaded && <p className="overlay__hint">タップして次へ</p>}
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
