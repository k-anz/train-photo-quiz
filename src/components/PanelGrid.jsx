// src/components/PanelGrid.jsx
import { Panel } from './Panel'

export function PanelGrid({ imagePath, openedPanels, onOpenPanel, phase }) {
  const closedPanelOrder = Array.from({ length: 9 }, (_, i) => i)
    .filter((i) => !openedPanels.has(i))

  const isAllOpen = phase === 'correct' || phase === 'finished'

  return (
    <div className="panel-grid-container">
      <img src={imagePath} className="quiz-image" alt="電車" />
      <div className="panel-grid">
        {Array.from({ length: 9 }, (_, i) => {
          const alreadyOpen = openedPanels.has(i)
          const domino = closedPanelOrder.indexOf(i)
          const revealDelay = isAllOpen && !alreadyOpen ? domino * 50 : 0

          return (
            <Panel
              key={i}
              isOpen={alreadyOpen || isAllOpen}
              onOpen={() => onOpenPanel(i)}
              revealDelay={revealDelay}
            />
          )
        })}
      </div>
    </div>
  )
}
