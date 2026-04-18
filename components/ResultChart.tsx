"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SimulationCase, SimulationResult } from "@/lib/types";

type Props = {
  cases: SimulationCase[];
  results: Record<string, SimulationResult>;
};

export default function ResultChart({ cases, results }: Props) {
  const data = cases.map((c) => ({
    name: c.name,
    額面: results[c.id].annualGross,
    手取り: results[c.id].annualTakeHome,
    控除: results[c.id].deductions.totalDeductions,
  }));

  return (
    <section className="h-[340px] rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">グラフ（年額比較）</h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${new Intl.NumberFormat("ja-JP").format(value)} 円`} />
          <Legend />
          <Bar dataKey="額面" fill="#94a3b8" />
          <Bar dataKey="手取り" fill="#16a34a" />
          <Bar dataKey="控除" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
