// src/components/Header.jsx
export function Header({ current, total, score }) {
  return (
    <header className="header">
      <span className="header__question">問題 {current} / {total}</span>
      <span className="header__score">スコア: {score}</span>
    </header>
  )
}
