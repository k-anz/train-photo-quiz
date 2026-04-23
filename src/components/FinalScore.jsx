// src/components/FinalScore.jsx
function getMessage(score, total) {
  const ratio = score / total
  if (ratio === 1) return '電車マスター！完璧です！🚄'
  if (ratio >= 0.7) return 'すごい！よく知っていますね！'
  if (ratio >= 0.5) return 'なかなかです！もう一度挑戦してみよう！'
  return 'まだまだこれから！もう一度挑戦！'
}

export function FinalScore({ score, total, onRetry }) {
  return (
    <div className="final-score">
      <p className="final-score__result">{total}問中{score}問正解！</p>
      <p className="final-score__message">{getMessage(score, total)}</p>
      <button className="btn--retry" onClick={onRetry}>
        もう一度挑戦
      </button>
    </div>
  )
}
