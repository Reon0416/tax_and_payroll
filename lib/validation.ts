import { z } from "zod";

export const simulationInputSchema = z
  .object({
    mode: z.enum(["annualIncome", "monthlyIncome"]),
    annualIncome: z.number().min(0).optional(),
    monthlyIncome: z.number().min(0).optional(),
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
  });

export type SimulationInputForm = z.infer<typeof simulationInputSchema>;
