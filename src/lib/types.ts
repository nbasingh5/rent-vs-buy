// src/lib/types.ts - Updated with monthly data tracking and investment details
// Form Input Types
export interface GeneralInputs {
  timeHorizon: number;
  annualIncome: number;
  incomeIncrease: boolean;
  annualIncomeGrowthRate: number;
  currentSavings: number;
  monthlyExpenses?: number; // Optional monthly expenses
  downPaymentPercent: number;
}

export interface BuyingInputs {
  housePrice: number;
  interestRate: number;
  loanTerm: number;
  loanType: "fixed" | "adjustable";
  propertyTaxRate: number;
  homeInsuranceRate: number;
  maintenanceCosts: number;
  usePercentageForMaintenance: boolean;
  appreciationScenario: "low" | "medium" | "high" | "custom";
  customAppreciationRate: number;
  downPaymentPercent: number;
  currentSavings: number;
}

export interface RentingInputs {
  monthlyRent: number;
  annualRentIncrease: number;
}

export interface InvestmentInputs {
  annualReturn: number;
  capitalGainsTaxRate: number;
}

export interface FormData {
  general: GeneralInputs;
  buying: BuyingInputs;
  renting: RentingInputs;
  investment: InvestmentInputs;
}

// Monthly Data Types
export interface MonthlyBuyingDataPoint {
  month: number;
  homeValue: number;
  homeEquity: number;
  loanBalance: number;
  mortgagePayment: number;
  principalPayment: number;
  interestPayment: number;
  propertyTaxes: number;
  homeInsurance: number;
  maintenanceCosts: number;
  amountInvested: number;
  investmentEarnings: number;
  yearlySavings: number;
  totalWealthBuying: number;
  investmentsWithEarnings: number;
  monthlyExpenses: number
}

export interface MonthlyRentingDataPoint {
  month: number;
  rent: number;
  yearlySavings: number;
  amountInvested: number;
  investmentEarnings: number;
  investmentValueBeforeTax: number;
  capitalGainsTax: number;
  totalWealthRenting: number;
}

// Calculation Result Types
export interface YearlyBuyingResult {
  year: number;
  mortgagePayment: number;
  principalPaid: number;
  interestPaid: number;
  loanBalance: number;
  propertyTaxes: number;
  homeInsurance: number;
  maintenanceCosts: number;
  homeValue: number;
  homeEquity: number;
  totalWealthBuying: number;
  yearlySavings: number;        
  amountInvested: number;         
  investmentEarnings: number;     
  investmentsWithEarnings: number;
  capitalGainsTaxPaid: number; 
  monthlyData?: MonthlyBuyingDataPoint[];
}

export interface YearlyRentingResult {
  year: number;
  totalRent: number;
  yearlyExpenses: number;
  amountInvested: number; 
  investmentValueBeforeTax: number;
  capitalGainsTaxPaid: number;
  investmentEarnings: number;
  totalWealthRenting: number;
  yearlySavings: number;       
  investmentsWithEarnings: number; 
  initialInvestment?: number;
  monthlyData?: MonthlyRentingDataPoint[];
  annualReturnRate: number;
  capitalGainsTaxRate: number;
}

export interface YearlyComparison {
  year: number;
  buyingWealth: number;
  rentingWealth: number;
  difference: number;
  cumulativeBuyingCosts: number;
  cumulativeRentingCosts: number;
  buyingLeftoverIncome: number;
  rentingLeftoverIncome: number;
  buyingLeftoverInvestmentValue: number;
  rentingLeftoverInvestmentValue: number;
}

export interface ComparisonResults {
  yearlyComparisons: YearlyComparison[];
  buyingResults: YearlyBuyingResult[];
  rentingResults: YearlyRentingResult[];
  summary: {
    finalBuyingWealth: number;
    finalRentingWealth: number;
    difference: number;
    betterOption: "buying" | "renting" | "equal";
  };
  finalInvestmentAmount: number;
}
