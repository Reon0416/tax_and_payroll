export type InputMode = "annualIncome" | "monthlyIncome" | "monthlyPlusBonus";

export type SimulationInput = {
  mode: InputMode;
  annualIncome?: number;
  monthlyIncome?: number;
  monthlyBaseSalary?: number;
  bonusAmount?: number;
  bonusCount?: number;
  prefecture: string;
  age: number;
  dependents: number;
  hasSpouse: boolean;
  hasSocialInsurance: boolean;
  commutingAllowanceMonthly: number;
};

export type NormalizedIncome = {
  annualGross: number;
  monthlyGross: number;
  annualBonus: number;
  annualSalary: number;
  annualCommutingAllowance: number;
  taxableAnnualIncomeBase: number;
};

export type DeductionBreakdown = {
  incomeTax: number;
  residentTax: number;
  healthInsurance: number;
  pension: number;
  employmentInsurance: number;
  socialInsuranceTotal: number;
  totalDeductions: number;
};

export type SimulationResult = {
  annualGross: number;
  annualTakeHome: number;
  monthlyGross: number;
  monthlyTakeHome: number;
  bonusTakeHome: number;
  takeHomeRate: number;
  deductionRate: number;
  gapFromGross: number;
  deductions: DeductionBreakdown;
  notes: string[];
  taxableIncomeForIncomeTax: number;
  taxableIncomeForResidentTax: number;
};

export type SimulationCase = {
  id: string;
  name: string;
  input: SimulationInput;
};
