"use client";

import { useMemo, useState } from "react";
import ComparisonTable from "@/components/ComparisonTable";
import ResultChart from "@/components/ResultChart";
import SimulationForm from "@/components/SimulationForm";
import SummaryCards from "@/components/SummaryCards";
import { TARGET_FISCAL_YEAR } from "@/lib/constants";
import { simulateTakeHome } from "@/lib/calculation";
import type { SimulationCase } from "@/lib/types";

const createDefaultCase = (id: string, name: string): SimulationCase => ({
  id,
  name,
  input: {
    mode: "annualIncome",
    annualIncome: undefined,
    monthlyIncome: 0,
    prefecture: "東京都",
    age: 35,
    dependents: 0,
    hasSpouse: false,
    hasSocialInsurance: true,
    commutingAllowanceMonthly: 15000,
  },
});

export default function HomePage() {
  const [cases, setCases] = useState<SimulationCase[]>([
    createDefaultCase("case-1", "ケース1（基準）"),
    createDefaultCase("case-2", "ケース2"),
    createDefaultCase("case-3", "ケース3"),
  ]);
  const [activeId, setActiveId] = useState("case-1");

  const results = useMemo(
    () => Object.fromEntries(cases.map((caseItem) => [caseItem.id, simulateTakeHome(caseItem.input)])),
    [cases],
  );

  const activeCase = cases.find((c) => c.id === activeId) ?? cases[0];
  const activeResult = results[activeCase.id];

  const updateActiveCase = (nextInput: SimulationCase["input"]) => {
    setCases((prev) => prev.map((item) => (item.id === activeId ? { ...item, input: nextInput } : item)));
  };

  const duplicateCase = (id: string) => {
    setCases((prev) => {
      if (prev.length >= 3) return prev;
      const target = prev.find((item) => item.id === id);
      if (!target) return prev;
      const newCase: SimulationCase = {
        ...target,
        id: `case-${Date.now()}`,
        name: `${target.name}コピー`,
      };
      return [...prev, newCase].slice(0, 3);
    });
  };

  const renameCase = (id: string, name: string) => {
    setCases((prev) => prev.map((item) => (item.id === id ? { ...item, name } : item)));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_45%,_#f1f5f9)]">
      <div className="mx-auto max-w-6xl space-y-4 p-4 md:p-6">
        <header className="card-surface">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">日本の給与手取りシミュレーター（概算）</h1>
          <p className="mt-2 text-sm text-slate-600">
            年収・月収などの条件を変更し、年間手取りを比較できます。対象年度: {TARGET_FISCAL_YEAR}年度。
          </p>
        </header>

        <section className="card-surface border-cyan-100 bg-cyan-50/80 text-sm text-cyan-900">
          <h2 className="mb-2 text-base font-semibold">前提説明</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>会社員・公務員（会社員モデル）向けです。</li>
            <li>住民税は前年所得を使わない簡易推定です。</li>
            <li>通勤手当は非課税として扱います。</li>
            <li>制度改定に備え、税率・料率は設定ファイル分離しています。</li>
          </ul>
        </section>

        <SimulationForm activeCase={activeCase} onChange={updateActiveCase} />
        <SummaryCards result={activeResult} />
        <ComparisonTable
          cases={cases}
          results={results}
          activeId={activeId}
          onActivate={setActiveId}
          onDuplicate={duplicateCase}
          onRename={renameCase}
        />
        <ResultChart cases={cases} results={results} />

        <section className="card-surface border-amber-200 bg-amber-50/90 text-sm text-amber-900">
          <h2 className="mb-2 text-base font-semibold">注意事項（必読）</h2>
          <ul className="list-disc space-y-1 pl-5">
            {activeResult.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
