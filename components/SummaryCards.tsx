import type { SimulationResult } from "@/lib/types";
import { formatPercent, formatYen } from "./Currency";

export default function SummaryCards({ result }: { result: SimulationResult }) {
  const items = [
    ["年間額面", formatYen(result.annualGross)],
    ["年間手取り", formatYen(result.annualTakeHome)],
    ["月間額面", formatYen(result.monthlyGross)],
    ["月間手取り", formatYen(result.monthlyTakeHome)],
    ["額面との差額", formatYen(result.gapFromGross)],
    ["税・社会保険の控除率", formatPercent(result.deductionRate)],
  ];

  return (
    <section className="card-surface">
      <h2 className="mb-3 text-lg font-semibold">結果サマリー</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 transition hover:-translate-y-0.5 hover:shadow-sm">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="text-sm font-semibold md:text-base">{value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
