import { z } from "zod";

export const simulationInputSchema = z
  .object({
    mode: z.enum(["annualIncome", "monthlyIncome", "monthlyPlusBonus"]),
    annualIncome: z.number().min(0).optional(),
    monthlyIncome: z.number().min(0).optional(),
    monthlyBaseSalary: z.number().min(0).optional(),
    bonusAmount: z.number().min(0).optional(),
    bonusCount: z.number().min(0).max(6).optional(),
    prefecture: z.string().min(1),
    age: z.number().min(18).max(80),
    dependents: z.number().min(0).max(10),
    hasSpouse: z.boolean(),
    hasSocialInsurance: z.boolean(),
    commutingAllowanceMonthly: z.number().min(0),
  })
  .superRefine((val, ctx) => {
    if (val.mode === "annualIncome" && (val.annualIncome ?? 0) <= 0) {
      ctx.addIssue({ code: "custom", message: "年収を入力してください", path: ["annualIncome"] });
    }
    if (val.mode === "monthlyIncome" && (val.monthlyIncome ?? 0) <= 0) {
      ctx.addIssue({ code: "custom", message: "月収を入力してください", path: ["monthlyIncome"] });
    }
    if (val.mode === "monthlyPlusBonus" && (val.monthlyBaseSalary ?? 0) <= 0) {
      ctx.addIssue({ code: "custom", message: "月給を入力してください", path: ["monthlyBaseSalary"] });
    }
  });

export type SimulationInputForm = z.infer<typeof simulationInputSchema>;
