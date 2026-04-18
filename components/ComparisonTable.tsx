import type { SimulationCase, SimulationResult } from "@/lib/types";
import { formatPercent, formatYen } from "./Currency";

const resolveMonthlySalary = (caseItem: SimulationCase): number => {
  if (caseItem.input.mode === "monthlyPlusBonus") {
    return caseItem.input.monthlyBaseSalary ?? 0;
  }
  if (caseItem.input.mode === "monthlyIncome") {
    return caseItem.input.monthlyIncome ?? 0;
  }
  return Math.round((caseItem.input.annualIncome ?? 0) / 12);
};

type Props = {
  cases: SimulationCase[];
  results: Record<string, SimulationResult>;
  activeId: string;
  onActivate: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, name: string) => void;
};

export default function ComparisonTable({ cases, results, activeId, onActivate, onDuplicate, onRename }: Props) {
  const base = results[cases[0]?.id];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">比較テーブル（最大3ケース）</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-600">
              <th className="py-2">ケース</th>
              <th className="py-2">月給</th>
              <th className="py-2">年間手取り</th>
              <th className="py-2">差分</th>
              <th className="py-2">増減率</th>
              <th className="py-2">手取り率</th>
              <th className="py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem) => {
              const result = results[caseItem.id];
              const diff = base ? result.annualTakeHome - base.annualTakeHome : 0;
              const diffRate = base?.annualTakeHome ? diff / base.annualTakeHome : 0;
              return (
                <tr key={caseItem.id} className="border-b border-slate-100 align-middle">
                  <td className="py-2">
                    <input
                      value={caseItem.name}
                      onChange={(e) => onRename(caseItem.id, e.target.value)}
                      className={activeId === caseItem.id ? "border-indigo-400 bg-indigo-50/50" : ""}
                    />
                  </td>
                  <td>{formatYen(resolveMonthlySalary(caseItem))}</td>
                  <td className="font-medium text-slate-900">{formatYen(result.annualTakeHome)}</td>
                  <td className={diff >= 0 ? "text-emerald-600" : "text-rose-600"}>{formatYen(diff)}</td>
                  <td className={diff >= 0 ? "text-emerald-600" : "text-rose-600"}>{formatPercent(diffRate)}</td>
                  <td>{formatPercent(result.takeHomeRate)}</td>
                  <td className="space-x-2">
                    <button
                      type="button"
                      className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-indigo-700 shadow-sm transition active:translate-y-[1px] active:shadow-none"
                      onClick={() => onActivate(caseItem.id)}
                    >
                      選択
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 shadow-sm transition active:translate-y-[1px] active:shadow-none"
                      onClick={() => onDuplicate(caseItem.id)}
                    >
                      複製
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
