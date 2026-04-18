export const TARGET_FISCAL_YEAR = 2025;

export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
] as const;

export const DEFAULT_RATES = {
  employmentInsuranceRate: 0.006,
  pensionRate: 0.183,
  pensionEmployeeShare: 0.5,
  baseResidentTaxRate: 0.1,
  residentTaxPerCapita: 5000,
  residentTaxBasicDeduction: 430000,
  incomeTaxBasicDeduction: 480000,
  spouseDeduction: 380000,
  dependentDeduction: 380000,
  salaryIncomeDeductionMin: 550000,
};

export const HEALTH_INSURANCE_BY_PREFECTURE: Record<string, number> = {
  北海道: 0.1000, 青森県: 0.0993, 岩手県: 0.0985, 宮城県: 0.1012, 秋田県: 0.1005, 山形県: 0.0998,
  福島県: 0.0987, 茨城県: 0.0992, 栃木県: 0.0974, 群馬県: 0.0986, 埼玉県: 0.0984, 千葉県: 0.0995,
  東京都: 0.0998, 神奈川県: 0.1002, 新潟県: 0.0979, 富山県: 0.0991, 石川県: 0.0988, 福井県: 0.0989,
  山梨県: 0.0999, 長野県: 0.0980, 岐阜県: 0.0994, 静岡県: 0.0996, 愛知県: 0.0991, 三重県: 0.1001,
  滋賀県: 0.0988, 京都府: 0.1002, 大阪府: 0.1010, 兵庫県: 0.1004, 奈良県: 0.0997, 和歌山県: 0.1000,
  鳥取県: 0.0990, 島根県: 0.0992, 岡山県: 0.1000, 広島県: 0.1013, 山口県: 0.1005,
  徳島県: 0.1001, 香川県: 0.0990, 愛媛県: 0.1002, 高知県: 0.1007,
  福岡県: 0.1015, 佐賀県: 0.1004, 長崎県: 0.1001, 熊本県: 0.1009, 大分県: 0.1002,
  宮崎県: 0.1003, 鹿児島県: 0.1011, 沖縄県: 0.0995,
};

export const INCOME_TAX_BRACKETS = [
  { upTo: 1950000, rate: 0.05, deduction: 0 },
  { upTo: 3300000, rate: 0.1, deduction: 97500 },
  { upTo: 6950000, rate: 0.2, deduction: 427500 },
  { upTo: 9000000, rate: 0.23, deduction: 636000 },
  { upTo: 18000000, rate: 0.33, deduction: 1536000 },
  { upTo: 40000000, rate: 0.4, deduction: 2796000 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.45, deduction: 4796000 },
] as const;

export const RECOVERY_SURTAX_RATE = 0.021;
