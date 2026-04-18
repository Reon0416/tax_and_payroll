"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PREFECTURES } from "@/lib/constants";
import { simulationInputSchema, type SimulationInputForm } from "@/lib/validation";
import type { SimulationCase } from "@/lib/types";

type Props = {
  activeCase: SimulationCase;
  onChange: (next: SimulationInputForm) => void;
};

const numberParser = (v: string) => (v === "" ? 0 : Number(v));
const numberOrUndefinedParser = (v: string) => (v === "" ? undefined : Number(v));

export default function SimulationForm({ activeCase, onChange }: Props) {
  const { control, watch, formState } = useForm<SimulationInputForm>({
    resolver: zodResolver(simulationInputSchema),
    mode: "onChange",
    defaultValues: activeCase.input,
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const parsed = simulationInputSchema.safeParse(value);
      if (parsed.success) {
        onChange(parsed.data);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const mode = watch("mode");

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">入力フォーム</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          入力モード
          <Controller
            name="mode"
            control={control}
            render={({ field }) => (
              <select {...field}>
                <option value="annualIncome">年収から入力</option>
                <option value="monthlyIncome">月収から入力</option>
                <option value="monthlyPlusBonus">月給＋賞与から入力</option>
              </select>
            )}
          />
        </label>

        {mode === "annualIncome" && (
          <label className="flex flex-col gap-1">
            年収（円）
            <Controller
              name="annualIncome"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="例: 5000000"
                  value={field.value === undefined ? "" : String(field.value)}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/[^\d]/g, "");
                    field.onChange(digitsOnly === "" ? undefined : Number(digitsOnly));
                  }}
                />
              )}
            />
            <p className="text-xs text-red-600">{formState.errors.annualIncome?.message}</p>
          </label>
        )}

        {mode === "monthlyIncome" && (
          <label className="flex flex-col gap-1">
            月収（円）
            <Controller
              name="monthlyIncome"
              control={control}
              render={({ field }) => <input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(numberOrUndefinedParser(e.target.value))} />}
            />
            <p className="text-xs text-red-600">{formState.errors.monthlyIncome?.message}</p>
          </label>
        )}

        {mode === "monthlyPlusBonus" && (
          <>
            <label className="flex flex-col gap-1">
              月給（円）
              <Controller
                name="monthlyBaseSalary"
                control={control}
                render={({ field }) => <input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(numberOrUndefinedParser(e.target.value))} />}
              />
              <p className="text-xs text-red-600">{formState.errors.monthlyBaseSalary?.message}</p>
            </label>
            <label className="flex flex-col gap-1">
              賞与額（1回あたり円）
              <Controller
                name="bonusAmount"
                control={control}
                render={({ field }) => <input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(numberOrUndefinedParser(e.target.value))} />}
              />
            </label>
            <label className="flex flex-col gap-1">
              賞与回数
              <Controller
                name="bonusCount"
                control={control}
                render={({ field }) => <input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(numberOrUndefinedParser(e.target.value))} />}
              />
            </label>
          </>
        )}

        <label className="flex flex-col gap-1">
          都道府県
          <Controller
            name="prefecture"
            control={control}
            render={({ field }) => (
              <select {...field}>
                {PREFECTURES.map((pref) => (
                  <option value={pref} key={pref}>{pref}</option>
                ))}
              </select>
            )}
          />
        </label>

        <label className="flex flex-col gap-1">年齢
          <Controller name="age" control={control} render={({ field }) => <input type="number" value={field.value} onChange={(e) => field.onChange(numberParser(e.target.value))} />} />
        </label>
        <label className="flex flex-col gap-1">扶養人数
          <Controller name="dependents" control={control} render={({ field }) => <input type="number" value={field.value} onChange={(e) => field.onChange(numberParser(e.target.value))} />} />
        </label>
        <label className="flex flex-col gap-1">通勤手当（月額円）
          <Controller name="commutingAllowanceMonthly" control={control} render={({ field }) => <input type="number" value={field.value} onChange={(e) => field.onChange(numberParser(e.target.value))} />} />
        </label>

        <label className="flex items-center gap-2">
          <Controller name="hasSpouse" control={control} render={({ field }) => <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} />
          配偶者あり
        </label>
        <label className="flex items-center gap-2">
          <Controller name="hasSocialInsurance" control={control} render={({ field }) => <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} />
          社会保険に加入
        </label>
      </div>
    </section>
  );
}
