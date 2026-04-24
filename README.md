# 電車写真クイズ

電車の写真を見て、車両名を当てるクイズアプリです。

## デモ

パネルが少しずつ開いていき、車両の写真が明らかになる中で正解を目指してください。

## 機能

- パネルを段階的に開いて写真を少しずつ公開
- 4択の選択肢から正解を選ぶ
- 正解・不正解の効果音フィードバック
- 全問終了後にスコアと結果メッセージを表示
- 「もう一度挑戦」ボタンでリスタート

## 技術スタック

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)（状態管理）
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)（テスト）

## セットアップ

```bash
npm install
```

## 開発サーバー起動

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

## テスト

```bash
npm test
```

## 問題の追加

`src/data/questions.json` に問題を追加できます。

```json
{
  "id": 1,
  "image": "photo.jpg",
  "answer": "E5系",
  "choices": ["E5系", "N700系", "500系", "700系"]
}
```

| フィールド | 説明 |
|---|---|
| `id` | 問題のID（一意） |
| `image` | `public/` 以下の画像パス |
| `answer` | 正解の選択肢 |
| `choices` | 4つの選択肢（正解を含む） |
