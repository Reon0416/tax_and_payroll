import type { SimulationCase, SimulationResult } from "@/lib/types";
import { formatPercent, formatYen } from "./Currency";

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
    <section className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">比較テーブル（最大3ケース）</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2">ケース</th>
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
                <tr key={caseItem.id} className="border-b border-slate-100">
                  <td className="py-2">
                    <input
                      value={caseItem.name}
                      onChange={(e) => onRename(caseItem.id, e.target.value)}
                      className={activeId === caseItem.id ? "border-blue-400" : ""}
                    />
                  </td>
                  <td>{formatYen(result.annualTakeHome)}</td>
                  <td>{formatYen(diff)}</td>
                  <td>{formatPercent(diffRate)}</td>
                  <td>{formatPercent(result.takeHomeRate)}</td>
                  <td className="space-x-2">
                    <button type="button" className="bg-slate-100 px-2 py-1" onClick={() => onActivate(caseItem.id)}>選択</button>
                    <button type="button" className="bg-slate-100 px-2 py-1" onClick={() => onDuplicate(caseItem.id)}>複製</button>
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
