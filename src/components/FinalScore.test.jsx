// @vitest-environment node
// src/components/FinalScore.test.jsx
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { FinalScore } from './FinalScore'

describe('FinalScore component', () => {
  it('正解数と総問題数を表示する', () => {
    const html = renderToString(React.createElement(FinalScore, { score: 3, total: 5, onRetry: () => {} }))
    expect(html).toMatch(/5.*問中.*3.*問正解/)
  })

  it('全問正解のとき「電車マスター」メッセージを表示する', () => {
    const html = renderToString(React.createElement(FinalScore, { score: 5, total: 5, onRetry: () => {} }))
    expect(html).toContain('電車マスター')
  })

  it('70%以上正解のとき「すごい！」メッセージを表示する', () => {
    const html = renderToString(React.createElement(FinalScore, { score: 4, total: 5, onRetry: () => {} }))
    expect(html).toContain('すごい！')
  })

  it('50%未満のとき「もう一度挑戦」メッセージを表示する', () => {
    const html = renderToString(React.createElement(FinalScore, { score: 2, total: 5, onRetry: () => {} }))
    expect(html).toContain('もう一度挑戦')
  })

  it('「もう一度挑戦」ボタンが表示される', () => {
    const html = renderToString(React.createElement(FinalScore, { score: 3, total: 5, onRetry: () => {} }))
    expect(html).toContain('もう一度挑戦')
  })
})
