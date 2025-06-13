import {
  ComparisonResults,
  FormData,
  YearlyComparison,
} from "../types";
import { calculateInvestmentReturnForMonth, calculateCapitalGainsTax } from "./investmentUtils";
import { calculateBuyingYearlyData } from "./buyingCalculator";
import { calculateRentingYearlyData } from "./rentingCalculator";

// Main calculation function - orchestrates buying and renting calculations
export const calculateComparison = (formData: FormData): ComparisonResults => {
  const { general, buying, renting, investment } = formData;
  const timeHorizonYears = buying.loanTerm;
  const timeHorizonMonths = timeHorizonYears * 12;

  // --- Get Raw Scenario Data (costs and equity only) ---
  const { buyingResults } = calculateBuyingYearlyData({ buying, investment });
  const { rentingResults } = calculateRentingYearlyData({ renting, loanTerm: buying.loanTerm });

  // --- Initialize Investment & Wealth Tracking ---
  const downPaymentAmount = buying.housePrice * (buying.downPaymentPercent / 100);
  
  let buyingInvestmentValue = 0;
  let rentingInvestmentValue = 0;

  // Set initial investment values based on the calculation mode
  if (general.useIncomeAndSavings) {
    // Personalized Mode: Buying invests leftover savings; Renting invests ALL savings.
    buyingInvestmentValue = Math.max(0, general.currentSavings - downPaymentAmount);
    rentingInvestmentValue = general.currentSavings;
  } else {
    // Simple Mode: Assume only capital is the down payment.
    buyingInvestmentValue = 0; // No leftover savings to invest when buying.
    rentingInvestmentValue = downPaymentAmount; // The down payment is invested instead.
  }

  let buyingTotalContributions = buyingInvestmentValue;
  let rentingTotalContributions = rentingInvestmentValue;

  // --- Monthly Simulation Loop ---
  for (let month = 1; month <= timeHorizonMonths; month++) {
    const year = Math.ceil(month / 12);
    const monthIndex = (month - 1) % 12;

    const buyingMonthRaw = buyingResults[year].monthlyData[monthIndex];
    const rentingMonthRaw = rentingResults[year].monthlyData[monthIndex];

    // 1. Grow existing investments
    const buyingReturn = calculateInvestmentReturnForMonth(buyingInvestmentValue, investment.annualReturn);
    buyingInvestmentValue += buyingReturn;
    
    const rentingReturn = calculateInvestmentReturnForMonth(rentingInvestmentValue, investment.annualReturn);
    rentingInvestmentValue += rentingReturn;

    // 2. Determine monthly savings and invest them
    const buyingMonthlyExpense = buyingMonthRaw.monthlyExpenses;
    const rentingMonthlyExpense = rentingMonthRaw.rent;
    const savings = Math.abs(buyingMonthlyExpense - rentingMonthlyExpense);

    if (buyingMonthlyExpense < rentingMonthlyExpense) {
      buyingInvestmentValue += savings;
      buyingTotalContributions += savings;
    } else {
      rentingInvestmentValue += savings;
      rentingTotalContributions += savings;
    }

    // 3. Update monthly data points with new investment values
    const buyingMonthFinal = buyingResults[year].monthlyData[monthIndex];
    buyingMonthFinal.amountInvested = buyingTotalContributions;
    buyingMonthFinal.investmentEarnings = buyingInvestmentValue - buyingTotalContributions;
    buyingMonthFinal.investmentsWithEarnings = buyingInvestmentValue;
    buyingMonthFinal.totalWealthBuying = buyingMonthFinal.homeEquity + buyingInvestmentValue;

    const rentingMonthFinal = rentingResults[year].monthlyData[monthIndex];
    rentingMonthFinal.amountInvested = rentingTotalContributions;
    rentingMonthFinal.investmentEarnings = rentingInvestmentValue - rentingTotalContributions;
    rentingMonthFinal.investmentsWithEarnings = rentingInvestmentValue;
    rentingMonthFinal.totalWealthRenting = rentingInvestmentValue;
  }

  // --- Aggregate Monthly Data to Yearly Results & Handle Taxes ---
  const yearlyComparisons: YearlyComparison[] = [];

  for (let year = 0; year <= timeHorizonYears; year++) {
    if (year === 0) {
      const initialBuyingEquity = buyingResults[0].homeEquity;
      buyingResults[0].totalWealthBuying = initialBuyingEquity + buyingInvestmentValue;
      rentingResults[0].totalWealthRenting = rentingInvestmentValue;
      buyingResults[0].investmentsWithEarnings = buyingInvestmentValue;
      buyingResults[0].amountInvested = buyingInvestmentValue;
      rentingResults[0].investmentsWithEarnings = rentingInvestmentValue;
      rentingResults[0].amountInvested = rentingInvestmentValue;

       yearlyComparisons.push({
        year: 0,
        buyingWealth: buyingResults[0].totalWealthBuying,
        rentingWealth: rentingResults[0].totalWealthRenting,
        difference: buyingResults[0].totalWealthBuying - rentingResults[0].totalWealthRenting,
        cumulativeBuyingCosts: 0,
        cumulativeRentingCosts: 0,
      });
      continue;
    }
    
    const lastMonthOfYear = buyingResults[year].monthlyData[11];
    const buyingYear = buyingResults[year];
    buyingYear.investmentsWithEarnings = lastMonthOfYear.investmentsWithEarnings;
    buyingYear.investmentEarnings = lastMonthOfYear.investmentEarnings;
    buyingYear.amountInvested = lastMonthOfYear.amountInvested;
    buyingYear.totalWealthBuying = lastMonthOfYear.totalWealthBuying;

    const lastRentingMonth = rentingResults[year].monthlyData[11];
    const rentingYear = rentingResults[year];
    rentingYear.investmentsWithEarnings = lastRentingMonth.investmentsWithEarnings;
    rentingYear.investmentEarnings = lastRentingMonth.investmentEarnings;
    rentingYear.amountInvested = lastRentingMonth.amountInvested;
    rentingYear.totalWealthRenting = lastRentingMonth.totalWealthRenting;

    // Apply capital gains tax only in the final year of the horizon
    if (year === timeHorizonYears) {
      const buyingTax = calculateCapitalGainsTax(buyingYear.investmentEarnings, investment.capitalGainsTaxRate);
      buyingYear.capitalGainsTaxPaid = buyingTax;
      buyingYear.totalWealthBuying -= buyingTax;

      const rentingTax = calculateCapitalGainsTax(rentingYear.investmentEarnings, investment.capitalGainsTaxRate);
      rentingYear.capitalGainsTaxPaid = rentingTax;
      rentingYear.totalWealthRenting -= rentingTax;
    }

    const prevComparison = yearlyComparisons[year - 1];
    const cumulativeBuyingCosts = prevComparison.cumulativeBuyingCosts + buyingYear.mortgagePayment + buyingYear.propertyTaxes + buyingYear.homeInsurance + buyingYear.maintenanceCosts;
    const cumulativeRentingCosts = prevComparison.cumulativeRentingCosts + rentingYear.totalRent;

    yearlyComparisons.push({
      year,
      buyingWealth: buyingYear.totalWealthBuying,
      rentingWealth: rentingYear.totalWealthRenting,
      difference: buyingYear.totalWealthBuying - rentingYear.totalWealthRenting,
      cumulativeBuyingCosts,
      cumulativeRentingCosts,
    });
  }

  // --- Final Summary ---
  const finalComparison = yearlyComparisons[timeHorizonYears];
  const betterOption = finalComparison.difference > 0 ? "buying" : finalComparison.difference < 0 ? "renting" : "equal";

  return {
    yearlyComparisons,
    buyingResults,
    rentingResults,
    summary: {
      finalBuyingWealth: finalComparison.buyingWealth,
      finalRentingWealth: finalComparison.rentingWealth,
      difference: Math.abs(finalComparison.difference),
      betterOption,
    },
  };
};

/**
 * Calculate the absolute difference between two values
 * @param value1 First value
 * @param value2 Second value
 * @returns Absolute difference between the values
 */
export const calculateAbsoluteDifference = (value1: number, value2: number): number => {
  return Math.abs(value1 - value2);
};