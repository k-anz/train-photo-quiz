// src/components/Choices.jsx
import { useState, useEffect } from 'react'

export function Choices({ choices, onSelect, phase }) {
  const [lastSelected, setLastSelected] = useState(null)

  useEffect(() => {
    if (phase === 'playing') setLastSelected(null)
  }, [phase])

  const handleSelect = (choice) => {
    if (phase !== 'playing') return
    setLastSelected(choice)
    onSelect(choice)
  }

  return (
    <div className="choices">
      {choices.map((choice) => (
        <button
          key={choice}
          className={`choice-btn${
            phase === 'wrong' && choice === lastSelected ? ' choice-btn--shake' : ''
          }`}
          onClick={() => handleSelect(choice)}
          disabled={phase !== 'playing'}
        >
          {choice}
        </button>
      ))}
    </div>
  )
}
