import {
  DEFAULT_RATES,
  HEALTH_INSURANCE_BY_PREFECTURE,
  INCOME_TAX_BRACKETS,
  PREFECTURES,
  RECOVERY_SURTAX_RATE,
} from "./constants";
import type { DeductionBreakdown, NormalizedIncome, SimulationInput, SimulationResult } from "./types";

const roundYen = (value: number) => Math.round(value);

/**
 * 給与所得控除（簡易）。国税庁の区分に近い式を使う。
 */
export const calculateSalaryIncomeDeduction = (annualSalary: number): number => {
  if (annualSalary <= 1625000) {
    return DEFAULT_RATES.salaryIncomeDeductionMin;
  }
  if (annualSalary <= 1800000) {
    return annualSalary * 0.4 - 100000;
  }
  if (annualSalary <= 3600000) {
    return annualSalary * 0.3 + 80000;
  }
  if (annualSalary <= 6600000) {
    return annualSalary * 0.2 + 440000;
  }
  if (annualSalary <= 8500000) {
    return annualSalary * 0.1 + 1100000;
  }
  return 1950000;
};

/**
 * 入力モード差分を共通形式に変換する。
 * 通勤手当は非課税前提のため、課税ベースは給与部分から控除する。
 */
export const normalizeIncome = (input: SimulationInput): NormalizedIncome => {
  const annualCommutingAllowance = Math.max(0, input.commutingAllowanceMonthly) * 12;

  if (input.mode === "annualIncome") {
    const annualGross = Math.max(0, input.annualIncome ?? 0);
    const annualBonus = roundYen(annualGross * 0.2);
    const annualSalary = Math.max(0, annualGross - annualBonus);
    return {
      annualGross,
      monthlyGross: annualGross / 12,
      annualBonus,
      annualSalary,
      annualCommutingAllowance,
      taxableAnnualIncomeBase: Math.max(0, annualSalary - annualCommutingAllowance) + annualBonus,
    };
  }

  if (input.mode === "monthlyIncome") {
    const monthlyGross = Math.max(0, input.monthlyIncome ?? 0);
    const annualGross = monthlyGross * 12;
    const annualBonus = 0;
    const annualSalary = annualGross;
    return {
      annualGross,
      monthlyGross,
      annualBonus,
      annualSalary,
      annualCommutingAllowance,
      taxableAnnualIncomeBase: Math.max(0, annualSalary - annualCommutingAllowance) + annualBonus,
    };
  }

  const monthlyBaseSalary = Math.max(0, input.monthlyBaseSalary ?? 0);
  const bonusAmount = Math.max(0, input.bonusAmount ?? 0);
  const bonusCount = Math.max(0, input.bonusCount ?? 0);
  const annualBonus = bonusAmount * bonusCount;
  const annualSalary = monthlyBaseSalary * 12;
  const annualGross = annualSalary + annualBonus;

  return {
    annualGross,
    monthlyGross: annualGross / 12,
    annualBonus,
    annualSalary,
    annualCommutingAllowance,
    taxableAnnualIncomeBase: Math.max(0, annualSalary - annualCommutingAllowance) + annualBonus,
  };
};

/**
 * 健康保険料率は都道府県ごと、40-64歳は介護保険を簡易加算する。
 */
export const calculateHealthInsurance = (income: NormalizedIncome, age: number, prefecture: string) => {
  const baseRate = HEALTH_INSURANCE_BY_PREFECTURE[prefecture] ?? HEALTH_INSURANCE_BY_PREFECTURE[PREFECTURES[12]];
  const careRate = age >= 40 && age < 65 ? 0.016 : 0;
  const employeeShare = 0.5;
  return roundYen(income.annualGross * (baseRate + careRate) * employeeShare);
};

export const calculateEmploymentInsurance = (income: NormalizedIncome) => {
  return roundYen(income.annualGross * DEFAULT_RATES.employmentInsuranceRate);
};

export const calculatePension = (income: NormalizedIncome) => {
  return roundYen(income.annualGross * DEFAULT_RATES.pensionRate * DEFAULT_RATES.pensionEmployeeShare);
};

/**
 * 所得税は超過累進課税で計算する。
 * 速算表（税率/控除額）と同値だが、段階ごとの税額を積み上げることで
 * ロジックを明示し、制度説明しやすくする。
 */
const calculateIncomeTaxRaw = (taxableIncome: number): number => {
  if (taxableIncome <= 0) return 0;

  let lowerBound = 0;
  let totalTax = 0;

  for (const bracket of INCOME_TAX_BRACKETS) {
    const upperBound = bracket.upTo;
    const taxableInBracket = Math.max(0, Math.min(taxableIncome, upperBound) - lowerBound);

    if (taxableInBracket > 0) {
      totalTax += taxableInBracket * bracket.rate;
    }

    if (taxableIncome <= upperBound) {
      break;
    }

    lowerBound = upperBound;
  }

  return Math.max(0, totalTax);
};

export const simulateTakeHome = (input: SimulationInput): SimulationResult => {
  const income = normalizeIncome(input);
  const notes: string[] = [
    "本計算は概算です。税額決定通知・給与明細の実額とは差が出る場合があります。",
    "住民税は当年収から推計する簡易モデルです（前年所得の厳密反映なし）。",
    "通勤手当は非課税として扱っています。",
  ];

  const salaryIncomeDeduction = calculateSalaryIncomeDeduction(income.taxableAnnualIncomeBase);

  const healthInsurance = input.hasSocialInsurance ? calculateHealthInsurance(income, input.age, input.prefecture) : 0;
  const pension = input.hasSocialInsurance ? calculatePension(income) : 0;
  const employmentInsurance = input.hasSocialInsurance ? calculateEmploymentInsurance(income) : 0;
  const socialInsuranceTotal = healthInsurance + pension + employmentInsurance;

  const personalDeductions =
    DEFAULT_RATES.incomeTaxBasicDeduction +
    (input.hasSpouse ? DEFAULT_RATES.spouseDeduction : 0) +
    input.dependents * DEFAULT_RATES.dependentDeduction;

  // 課税所得（所得税）は「課税対象給与 - 給与所得控除 - 社会保険料 - 人的控除」で近似。
  const taxableIncomeForIncomeTax = Math.max(
    0,
    roundYen(income.taxableAnnualIncomeBase - salaryIncomeDeduction - socialInsuranceTotal - personalDeductions),
  );

  const incomeTaxBase = calculateIncomeTaxRaw(taxableIncomeForIncomeTax);
  const incomeTax = roundYen(incomeTaxBase * (1 + RECOVERY_SURTAX_RATE));

  // 住民税は基礎控除を所得税より小さめにし、均等割を加算。
  const residentTaxDeductions =
    DEFAULT_RATES.residentTaxBasicDeduction +
    (input.hasSpouse ? DEFAULT_RATES.spouseDeduction : 0) +
    input.dependents * DEFAULT_RATES.dependentDeduction;

  const taxableIncomeForResidentTax = Math.max(
    0,
    roundYen(income.taxableAnnualIncomeBase - salaryIncomeDeduction - socialInsuranceTotal - residentTaxDeductions),
  );

  const residentTax = roundYen(
    taxableIncomeForResidentTax * DEFAULT_RATES.baseResidentTaxRate + DEFAULT_RATES.residentTaxPerCapita,
  );

  const deductions: DeductionBreakdown = {
    incomeTax,
    residentTax,
    healthInsurance,
    pension,
    employmentInsurance,
    socialInsuranceTotal,
    totalDeductions: incomeTax + residentTax + socialInsuranceTotal,
  };

  const annualTakeHome = Math.max(0, roundYen(income.annualGross - deductions.totalDeductions));
  const monthlyTakeHome = roundYen((annualTakeHome - (income.annualBonus / Math.max(1, input.bonusCount ?? 1))) / 12);
  const bonusTakeHome = roundYen(input.bonusCount ? income.annualBonus / input.bonusCount : 0);

  return {
    annualGross: roundYen(income.annualGross),
    annualTakeHome,
    monthlyGross: roundYen(income.monthlyGross),
    monthlyTakeHome,
    bonusTakeHome,
    gapFromGross: roundYen(income.annualGross - annualTakeHome),
    takeHomeRate: income.annualGross > 0 ? annualTakeHome / income.annualGross : 0,
    deductionRate: income.annualGross > 0 ? deductions.totalDeductions / income.annualGross : 0,
    deductions,
    notes,
    taxableIncomeForIncomeTax,
    taxableIncomeForResidentTax,
  };
};
