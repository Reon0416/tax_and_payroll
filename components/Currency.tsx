export const formatYen = (amount: number) =>
  new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(amount);

export const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
