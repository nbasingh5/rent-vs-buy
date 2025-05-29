// src/lib/utils/rentingCalculator.ts
import {
  RentingInputs,
  InvestmentInputs,
  MonthlyRentingDataPoint,
  YearlyRentingResult,
  BuyingInputs,
} from "../types";


interface RentingCalculationInputs {
  renting: RentingInputs;
  buying: BuyingInputs;
  investment: InvestmentInputs;
}

interface RentingCalculationResult {
  rentingResults: YearlyRentingResult[];
}

export const calculateRentingYearlyData = ({
  renting,
  buying,
  investment
}: RentingCalculationInputs): RentingCalculationResult => {
  const rentingResults: YearlyRentingResult[] = [];
  const monthlyRentingData: Record<number, MonthlyRentingDataPoint[]> = {};
  let monthlyRent = renting.monthlyRent;
  let rentingInvestmentValue = buying.currentSavings;

  monthlyRentingData[0] = [];
  for (let month = 1; month <= 12; month++) {
    monthlyRentingData[0].push({
      month,
      rent: 0,
      yearlySavings: 0,
      amountInvested: rentingInvestmentValue,
      investmentEarnings: 0,
      investmentValueBeforeTax: rentingInvestmentValue,
      capitalGainsTax: 0,
      totalWealthRenting: rentingInvestmentValue
    });
  }

  rentingResults.push({
    year: 0,
    totalRent: 0,
    yearlyExpenses: monthlyRent* 12,
    yearlySavings: 0,
    amountInvested: rentingInvestmentValue,
    investmentValueBeforeTax: rentingInvestmentValue,
    capitalGainsTaxPaid: 0,
    totalWealthRenting: rentingInvestmentValue,
    investmentsWithEarnings: rentingInvestmentValue,
    initialInvestment: rentingInvestmentValue,
    investmentEarnings: 0,
    monthlyData: monthlyRentingData[0],
    annualReturnRate: investment.annualReturn,
    capitalGainsTaxRate: investment.capitalGainsTaxRate,
  });

  for (let year = 1; year <= buying.loanTerm; year++) {
    const totalGains = 0;
    let yearlyRent = 0;
    let yearlyLeftoverIncome = 0;
    const yearlyInvested = 0 

    monthlyRentingData[year] = [];

    const previousYear = rentingResults[year - 1];
    const startOfYearBalance = previousYear.investmentValueBeforeTax;
    let previousMonthInvestmentValue = startOfYearBalance;

    for (let month = 1; month <= 12; month++) {
      yearlyRent += monthlyRent;
      const monthlyExpenses = monthlyRent
      yearlyLeftoverIncome += monthlyExpenses;

      monthlyRentingData[year].push({
        month,
        rent: monthlyRent,
        yearlySavings: 0,
        amountInvested: 0,
        investmentEarnings: 0,
        investmentValueBeforeTax: 0,
        capitalGainsTax: 0,
        totalWealthRenting: 0
      });
    }

    rentingResults.push({
      year,
      totalRent: yearlyRent,
      yearlyExpenses: (renting.monthlyRent || 0) * 12, // Annual total of monthly expenses
      amountInvested: yearlyInvested,
      investmentValueBeforeTax: rentingInvestmentValue,
      capitalGainsTaxPaid: 0,
      totalWealthRenting: rentingInvestmentValue,
      yearlySavings: yearlyLeftoverIncome,
      investmentsWithEarnings: rentingInvestmentValue,
      investmentEarnings: totalGains,
      monthlyData: monthlyRentingData[year],
      annualReturnRate: investment.annualReturn,
      capitalGainsTaxRate: investment.capitalGainsTaxRate,
    });

    monthlyRent *= 1 + renting.annualRentIncrease / 100;
  }

  return {
    rentingResults,
  };
};
