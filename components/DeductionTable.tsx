import type { SimulationResult } from "@/lib/types";
import { formatYen } from "./Currency";

export default function DeductionTable({ result }: { result: SimulationResult }) {
  const rows = [
    ["所得税", result.deductions.incomeTax],
    ["住民税", result.deductions.residentTax],
    ["健康保険料", result.deductions.healthInsurance],
    ["厚生年金保険料", result.deductions.pension],
    ["雇用保険料", result.deductions.employmentInsurance],
    ["社会保険料合計", result.deductions.socialInsuranceTotal],
    ["控除合計", result.deductions.totalDeductions],
  ];

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">控除内訳（年額）</h2>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-slate-100">
              <td className="py-2">{label}</td>
              <td className="py-2 text-right font-medium">{formatYen(value as number)}</td>
              <td className="py-2 text-right text-slate-500">{formatYen(Math.round((value as number) / 12))}/月</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 text-xs text-slate-600">
        課税所得（所得税）: {formatYen(result.taxableIncomeForIncomeTax)} / 課税所得（住民税）: {formatYen(result.taxableIncomeForResidentTax)}
      </div>
    </section>
  );
}
