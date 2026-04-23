// src/components/Panel.jsx
export function Panel({ isOpen, onOpen, revealDelay }) {
  return (
    <div
      className={`panel${isOpen ? ' panel--open' : ''}`}
      style={{ transitionDelay: isOpen ? `${revealDelay}ms` : '0ms' }}
      onClick={!isOpen ? onOpen : undefined}
      role="button"
      aria-label={isOpen ? '開いたパネル' : 'パネルをタップして開く'}
    />
  )
}
