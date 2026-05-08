import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ResultOverlay } from './ResultOverlay'

describe('ResultOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('正解時に「✓ 正解！」とボタンが両方表示される', () => {
    render(
      <ResultOverlay phase="correct" onNext={vi.fn()} onResumePlaying={vi.fn()} />
    )
    expect(screen.getByText('✓ 正解！')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /次の問題へ/ })).toBeInTheDocument()
  })

  it('1500ms 後に「✓ 正解！」が消えてボタンだけ残る', async () => {
    render(
      <ResultOverlay phase="correct" onNext={vi.fn()} onResumePlaying={vi.fn()} />
    )
    expect(screen.getByText('✓ 正解！')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.queryByText('✓ 正解！')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /次の問題へ/ })).toBeInTheDocument()
  })

  it('correct → playing → correct の遷移で「✓ 正解！」が再表示される', async () => {
    const { rerender } = render(
      <ResultOverlay phase="correct" onNext={vi.fn()} onResumePlaying={vi.fn()} />
    )

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })
    expect(screen.queryByText('✓ 正解！')).not.toBeInTheDocument()

    rerender(
      <ResultOverlay phase="playing" onNext={vi.fn()} onResumePlaying={vi.fn()} />
    )
    rerender(
      <ResultOverlay phase="correct" onNext={vi.fn()} onResumePlaying={vi.fn()} />
    )

    expect(screen.getByText('✓ 正解！')).toBeInTheDocument()
  })
})
