# 給与手取りシミュレーター（日本の給与所得者向け・概算）

Next.js + TypeScript + Tailwind CSS で作成した、給与所得者向けの手取りシミュレーションWebアプリです。

> **重要**: 本アプリは概算です。実際の源泉徴収・住民税決定額・標準報酬月額の等級計算・会社個別ルールとは差異が出ます。

## 1. ディレクトリ構成案

```text
.
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ globals.css
├─ components/
│  ├─ ComparisonTable.tsx
│  ├─ Currency.tsx
│  ├─ DeductionTable.tsx
│  ├─ ResultChart.tsx
│  ├─ SimulationForm.tsx
│  └─ SummaryCards.tsx
├─ lib/
│  ├─ calculation.ts
│  ├─ constants.ts
│  ├─ types.ts
│  └─ validation.ts
└─ README.md
```

## 2. 型定義

- `SimulationInput`: 入力フォームの統合型
- `InputMode`: `annualIncome` / `monthlyIncome` / `monthlyPlusBonus`
- `NormalizedIncome`: モード差分を吸収した内部計算型
- `DeductionBreakdown`: 控除内訳
- `SimulationResult`: サマリー + 控除 + 注記 + 課税所得
- `SimulationCase`: 比較ケース（名前付き）

## 3. 計算仕様（初期版）

### 実装対象
- 所得税（超過累進税率 + 復興特別所得税）
- 住民税（均等割 + 所得割の簡易推定）
- 健康保険（都道府県料率 + 40〜64歳介護保険加算）
- 厚生年金（料率の被保険者負担分）
- 雇用保険（労働者負担分）

### 主要前提
- 対象年度を `TARGET_FISCAL_YEAR` に固定し、将来差し替えしやすい設計
- 通勤手当は非課税扱いの簡易前提
- 住民税は当年収ベースの推定（前年所得の厳密再現なし）
- 公務員は会社員モデルと同一計算
- 社会保険未加入フラグ時は社保関連控除を0として計算

## 4. 画面構成

1. ヘッダー
2. 前提説明
3. 入力フォーム
4. 結果サマリー
5. 控除内訳（年額 + 月額）
6. 比較テーブル（3ケース）
7. グラフ（年額比較）
8. 注意事項

## 5. 入力モード

- 年収から入力
- 月収から入力
- 月給 + 賞与から入力

内部では `normalizeIncome` で共通形式へ正規化して計算します。

## 6. 比較シミュレーション

- 3ケースまで保持
- ケース名変更
- ケース選択
- ケース複製
- 年間手取り差分 / 増減率 / 手取り率を比較

## 7. セットアップ

```bash
npm install
npm run dev
```

`http://localhost:3000` で起動します。

## 8. テスト・確認コマンド

```bash
npm run typecheck
npm run build
```

## 9. 未実装事項・簡略化した前提

- 標準報酬月額・標準賞与額の等級テーブル厳密適用
- 住民税の前年所得連動、自治体ごとの均等割詳細
- 配偶者（特別）控除の所得制限、扶養控除の年齢区分
- 社会保険料の事業所要件/加入判定詳細（短時間労働者区分等）
- 退職/中途入社、年途中の異動、住民税特別徴収開始月
- 賞与手取りの源泉計算ロジック厳密化

## 10. 今後の改善案

- 年度別ルール（税率・控除・料率）を `lib/rules/{year}.ts` へ分割
- 「概算モード」と「実務近似モード」の2段階化
- グラフに月次推移（給与月/賞与月）を追加
- URLクエリへの入力シリアライズで比較条件共有
- ユニットテスト（Vitest）で計算関数を網羅
