# 電車写真パネルクイズ 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 電車写真を3×3パネルで隠し、1枚ずつ開きながら電車の種類を当てるブラウザクイズアプリをGitHub Pages向けに実装する。

**Architecture:** Vite + React でシングルページアプリを構築。全ゲーム状態（現在の問題・開いたパネル・スコア・フェーズ）を Zustand store に一元管理し、コンポーネントは表示のみに専念する。問題データは `src/data/questions.json`、電車写真は `public/images/` に配置する。

**Tech Stack:** React 18, Vite 5, Zustand 5, Vitest + @testing-library/react（テスト）, CSS transitions（アニメーション）, GitHub Actions（デプロイ）

---

## ファイルマップ

| ファイル | 役割 |
|---------|------|
| `vite.config.js` | Vite設定（GitHub Pages base path、Vitestテスト設定） |
| `src/main.jsx` | Reactエントリーポイント |
| `src/App.jsx` | 画面フロー管理（phaseに応じてクイズ画面/スコア画面を切り替え）・音声再生 |
| `src/App.css` | グローバルスタイル、CSS変数、アニメーション定義（flip, shake, toast） |
| `src/store/gameStore.js` | Zustand store: questions/currentIndex/openedPanels/phase/score + 全アクション |
| `src/data/questions.json` | 問題データ（電車名・選択肢・画像パス） |
| `src/components/Header.jsx` | 「問題N/M・スコア:N」ヘッダー表示 |
| `src/components/PanelGrid.jsx` | 3×3パネルグリッド（写真の上に重ねる・ドミノ遅延を計算） |
| `src/components/Panel.jsx` | 個別パネル（CSSフリップアニメーション） |
| `src/components/Choices.jsx` | 選択肢ボタン3つ（不正解時にshakeアニメーション） |
| `src/components/ResultOverlay.jsx` | 正解オーバーレイ（緑）・不正解トースト（赤・1.5秒で自動消滅） |
| `src/components/FinalScore.jsx` | 全問終了スコア画面 |
| `src/test/setup.js` | Vitest セットアップ（@testing-library/jest-dom） |
| `src/store/gameStore.test.js` | store の全アクション単体テスト |
| `src/components/Choices.test.jsx` | Choices コンポーネントテスト |
| `src/components/FinalScore.test.jsx` | FinalScore コンポーネントテスト |
| `.github/workflows/deploy.yml` | GitHub Actions: build → gh-pages デプロイ |

---

## Task 1: プロジェクトのスキャフォールドと依存関係のインストール

**Files:**
- Create: `vite.config.js`（上書き）
- Create: `src/test/setup.js`
- Modify: `.gitignore`

- [x] **Step 1: Vite + React プロジェクトを初期化する**
- [x] **Step 2: 依存関係をインストールする**
- [x] **Step 3: vite.config.js を書き換える（GitHub Pages base + Vitest設定）**
- [x] **Step 4: Vitest セットアップファイルを作成する**
- [x] **Step 5: package.json の scripts にテストコマンドを追加する**
- [x] **Step 6: .gitignore に `.superpowers/` を追加する**
- [x] **Step 7: dev server が起動することを確認する**
- [x] **Step 8: コミットする**

---

## Task 2: サンプル問題データの作成

**Files:**
- Create: `src/data/questions.json`

- [ ] **Step 1: questions.json を作成する**

開発用にプレースホルダー画像URLを使う。実際の電車写真を用意したら `public/images/` に置き、`imagePath` を `/images/ファイル名.jpg` に変更する。

```json
[
  {
    "id": 1,
    "imagePath": "https://picsum.photos/seed/train1/800/600",
    "answer": "E5系はやぶさ",
    "choices": ["E5系はやぶさ", "E6系こまち", "N700S のぞみ"]
  },
  {
    "id": 2,
    "imagePath": "https://picsum.photos/seed/train2/800/600",
    "answer": "E6系こまち",
    "choices": ["E5系はやぶさ", "E6系こまち", "700系ひかり"]
  },
  {
    "id": 3,
    "imagePath": "https://picsum.photos/seed/train3/800/600",
    "answer": "N700S のぞみ",
    "choices": ["N700S のぞみ", "500系のぞみ", "E6系こまち"]
  },
  {
    "id": 4,
    "imagePath": "https://picsum.photos/seed/train4/800/600",
    "answer": "700系ひかり",
    "choices": ["700系ひかり", "N700S のぞみ", "E5系はやぶさ"]
  },
  {
    "id": 5,
    "imagePath": "https://picsum.photos/seed/train5/800/600",
    "answer": "500系のぞみ",
    "choices": ["E6系こまち", "700系ひかり", "500系のぞみ"]
  }
]
```

- [ ] **Step 2: コミットする**

```bash
git add src/data/questions.json
git commit -m "feat: add sample quiz question data"
```

---

## Task 3: Zustand game store の実装とテスト

**Files:**
- Create: `src/store/gameStore.js`
- Create: `src/store/gameStore.test.js`

- [ ] **Step 1: テストファイルを先に書く（TDD）**

```js
// src/store/gameStore.test.js
import { useGameStore } from './gameStore'

const mockQuestions = [
  { id: 1, imagePath: '/img/a.jpg', answer: '電車A', choices: ['電車A', '電車B', '電車C'] },
  { id: 2, imagePath: '/img/b.jpg', answer: '電車B', choices: ['電車A', '電車B', '電車C'] },
]

beforeEach(() => {
  useGameStore.setState({
    questions: [],
    currentIndex: 0,
    openedPanels: new Set(),
    phase: 'playing',
    score: 0,
  })
})

describe('initGame', () => {
  it('問題をセットしてゲームを初期化する', () => {
    useGameStore.getState().initGame(mockQuestions)
    const state = useGameStore.getState()
    expect(state.questions).toHaveLength(2)
    expect(state.currentIndex).toBe(0)
    expect(state.openedPanels.size).toBe(0)
    expect(state.phase).toBe('playing')
    expect(state.score).toBe(0)
  })
})

describe('openPanel', () => {
  it('playing フェーズでパネルを開く', () => {
    useGameStore.setState({ phase: 'playing', openedPanels: new Set() })
    useGameStore.getState().openPanel(4)
    expect(useGameStore.getState().openedPanels.has(4)).toBe(true)
  })

  it('playing 以外のフェーズではパネルを開かない', () => {
    useGameStore.setState({ phase: 'correct', openedPanels: new Set() })
    useGameStore.getState().openPanel(4)
    expect(useGameStore.getState().openedPanels.size).toBe(0)
  })
})

describe('submitAnswer', () => {
  it('正解のとき phase が correct になりスコアが増える', () => {
    useGameStore.setState({
      questions: mockQuestions,
      currentIndex: 0,
      score: 0,
      phase: 'playing',
    })
    useGameStore.getState().submitAnswer('電車A')
    const state = useGameStore.getState()
    expect(state.phase).toBe('correct')
    expect(state.score).toBe(1)
  })

  it('不正解のとき phase が wrong になりスコアは変わらない', () => {
    useGameStore.setState({
      questions: mockQuestions,
      currentIndex: 0,
      score: 0,
      phase: 'playing',
    })
    useGameStore.getState().submitAnswer('電車B')
    const state = useGameStore.getState()
    expect(state.phase).toBe('wrong')
    expect(state.score).toBe(0)
  })
})

describe('resumePlaying', () => {
  it('phase を playing に戻す', () => {
    useGameStore.setState({ phase: 'wrong' })
    useGameStore.getState().resumePlaying()
    expect(useGameStore.getState().phase).toBe('playing')
  })
})

describe('nextQuestion', () => {
  it('次の問題に進む', () => {
    useGameStore.setState({
      questions: mockQuestions,
      currentIndex: 0,
      openedPanels: new Set([1, 2]),
      phase: 'correct',
    })
    useGameStore.getState().nextQuestion()
    const state = useGameStore.getState()
    expect(state.currentIndex).toBe(1)
    expect(state.openedPanels.size).toBe(0)
    expect(state.phase).toBe('playing')
  })

  it('最終問題の次は finished になる', () => {
    useGameStore.setState({
      questions: mockQuestions,
      currentIndex: 1,
      phase: 'correct',
    })
    useGameStore.getState().nextQuestion()
    expect(useGameStore.getState().phase).toBe('finished')
  })
})

describe('resetGame', () => {
  it('スコアと進行をリセットし問題をシャッフルして再開する', () => {
    useGameStore.setState({
      questions: mockQuestions,
      currentIndex: 1,
      score: 2,
      phase: 'finished',
      openedPanels: new Set([0, 1, 2]),
    })
    useGameStore.getState().resetGame()
    const state = useGameStore.getState()
    expect(state.currentIndex).toBe(0)
    expect(state.score).toBe(0)
    expect(state.phase).toBe('playing')
    expect(state.openedPanels.size).toBe(0)
    expect(state.questions).toHaveLength(2)
  })
})
```

- [ ] **Step 2: テストが失敗することを確認する**
- [ ] **Step 3: gameStore.js を実装する**
- [ ] **Step 4: テストが全部通ることを確認する**
- [ ] **Step 5: コミットする**

```bash
git add src/store/
git commit -m "feat: add Zustand game store with full game state management"
```

---

## Task 4: グローバルスタイルとCSSアニメーション

**Files:**
- Create: `src/App.css`（既存ファイルを全置き換え）

- [ ] **Step 1: App.css を書く**
- [ ] **Step 2: コミットする**

```bash
git add src/App.css
git commit -m "feat: add global styles and CSS animations"
```

---

## Task 5: Header コンポーネント

**Files:**
- Create: `src/components/Header.jsx`

- [ ] **Step 1: Header.jsx を実装する**

```jsx
// src/components/Header.jsx
export function Header({ current, total, score }) {
  return (
    <header className="header">
      <span className="header__question">問題 {current} / {total}</span>
      <span className="header__score">スコア: {score}</span>
    </header>
  )
}
```

- [ ] **Step 2: コミットする**

```bash
git add src/components/Header.jsx
git commit -m "feat: add Header component"
```

---

## Task 6: Panel コンポーネント

**Files:**
- Create: `src/components/Panel.jsx`

- [ ] **Step 1: Panel.jsx を実装する**

```jsx
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
```

- [ ] **Step 2: コミットする**

```bash
git add src/components/Panel.jsx
git commit -m "feat: add Panel component with CSS flip animation"
```

---

## Task 7: PanelGrid コンポーネント

**Files:**
- Create: `src/components/PanelGrid.jsx`

- [ ] **Step 1: PanelGrid.jsx を実装する**

```jsx
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
```

- [ ] **Step 2: コミットする**

```bash
git add src/components/PanelGrid.jsx
git commit -m "feat: add PanelGrid with domino reveal effect on correct answer"
```

---

## Task 8: Choices コンポーネントのテストと実装

**Files:**
- Create: `src/components/Choices.jsx`
- Create: `src/components/Choices.test.jsx`

- [ ] **Step 1: テストを書く**
- [ ] **Step 2: テストが失敗することを確認する**
- [ ] **Step 3: Choices.jsx を実装する**
- [ ] **Step 4: テストが通ることを確認する**
- [ ] **Step 5: コミットする**

```bash
git add src/components/Choices.jsx src/components/Choices.test.jsx
git commit -m "feat: add Choices component with shake animation on wrong answer"
```

---

## Task 9: ResultOverlay コンポーネント

**Files:**
- Create: `src/components/ResultOverlay.jsx`

- [ ] **Step 1: ResultOverlay.jsx を実装する**
- [ ] **Step 2: コミットする**

```bash
git add src/components/ResultOverlay.jsx
git commit -m "feat: add ResultOverlay for correct/wrong feedback"
```

---

## Task 10: FinalScore コンポーネントのテストと実装

**Files:**
- Create: `src/components/FinalScore.jsx`
- Create: `src/components/FinalScore.test.jsx`

- [ ] **Step 1: テストを書く**
- [ ] **Step 2: テストが失敗することを確認する**
- [ ] **Step 3: FinalScore.jsx を実装する**
- [ ] **Step 4: テストが通ることを確認する**
- [ ] **Step 5: コミットする**

```bash
git add src/components/FinalScore.jsx src/components/FinalScore.test.jsx
git commit -m "feat: add FinalScore screen with score-based messages"
```

---

## Task 11: App.jsx で全コンポーネントを結線する

**Files:**
- Modify: `src/App.jsx`（既存ファイルを全置き換え）
- Modify: `src/main.jsx`（既存ファイルを全置き換え）

- [ ] **Step 1: main.jsx を書き換える**
- [ ] **Step 2: App.jsx を実装する**
- [ ] **Step 3: dev server で動作確認する**
- [ ] **Step 4: コミットする**

```bash
git add src/App.jsx src/main.jsx
git commit -m "feat: wire all components together in App.jsx"
```

---

## Task 12: 本番用画像の配置とindex.htmlのタイトル設定

**Files:**
- Modify: `index.html`
- Modify: `src/data/questions.json`（画像パスを本番用に更新）

- [ ] **Step 1: 電車写真を public/images/ に配置する**
- [ ] **Step 2: questions.json の imagePath を本番パスに更新する**
- [ ] **Step 3: index.html のタイトルを変更する**
- [ ] **Step 4: 音声ファイルを public/sounds/ に配置する**
- [ ] **Step 5: コミットする**

---

## Task 13: GitHub Actions でデプロイ設定

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: vite.config.js の base がリポジトリ名と一致しているか確認する**
- [ ] **Step 2: GitHub Actions ワークフローを作成する**
- [ ] **Step 3: GitHub リポジトリの Pages 設定を有効にする**
- [ ] **Step 4: コミット・プッシュする**
- [ ] **Step 5: GitHub Actions が成功することを確認する**

---

## 完了チェックリスト

- [ ] `npm run test:run` で全テストが PASS する
- [ ] `npm run dev` でクイズが正常に遊べる
- [ ] パネルをタップするとフリップアニメーションで開く
- [ ] 正解時にドミノ倒し風の全開放が起きる
- [ ] 不正解時にトーストが1.5秒で消えてパネルを引き続き開けられる
- [ ] 全問終了後にスコア画面が表示される
- [ ] 「もう一度挑戦」でシャッフルしてリセットされる
- [ ] GitHub Pages にデプロイして本番で動作する
