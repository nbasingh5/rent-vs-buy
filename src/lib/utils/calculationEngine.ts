// src/lib/utils/calculationEngine.ts - Orchestrator
import {
  ComparisonResults,
  FormData,
  YearlyComparison,
} from "../types";
import { calculateInvestmentReturnForMonth } from "./investmentUtils";
import { calculateBuyingYearlyData } from "./buyingCalculator";
import { calculateRentingYearlyData } from "./rentingCalculator";

// Main calculation function - orchestrates buying and renting calculations
export const calculateComparison = (formData: FormData): ComparisonResults => {
  const { general, buying, renting, investment } = formData;
  const timeHorizonYears = general.timeHorizon;

  // --- Calculate Buying Scenario ---
  const { buyingResults } = calculateBuyingYearlyData({
    buying,
    investment,
  });

  // --- Calculate Renting Scenario ---
  const { rentingResults } = calculateRentingYearlyData({
    renting,
    buying,
    investment
  });

  // --- Combine Results and Calculate Comparisons ---
  const yearlyComparisons: YearlyComparison[] = [];
  let cumulativeBuyingCosts = 0;
  let cumulativeRentingCosts = 0;
  let finalInvestmentAmount = 0;

  for (let year = 0; year <= timeHorizonYears; year++) {
    const buyingYearData = buyingResults[year];
    const rentingYearData = rentingResults[year];

    const yearlyBuyingCosts = buyingYearData.interestPaid + 
                              buyingYearData.principalPaid + 
                              buyingYearData.propertyTaxes + 
                              buyingYearData.homeInsurance + 
                              buyingYearData.maintenanceCosts;

    const yearlyRentingCosts = rentingYearData.yearlyExpenses

    // Calculate monthly savings
    const monthlyBuyingCosts = yearlyBuyingCosts / 12;
    const monthlyRentingCosts = yearlyRentingCosts / 12;

    let monthlySavings = 0;
    let investmentAmount = buying.currentSavings;

    if (monthlyBuyingCosts < monthlyRentingCosts) {
      monthlySavings = monthlyRentingCosts - monthlyBuyingCosts;
    } else {
      monthlySavings = monthlyBuyingCosts - monthlyRentingCosts;
    }

    // Calculate investment return for the month
    const monthlyInvestmentReturn = calculateInvestmentReturnForMonth(
      investmentAmount,
      investment.annualReturn / 100
    );

    // Add investment return to investment amount
    investmentAmount += monthlyInvestmentReturn + monthlySavings;

    // Accumulate costs (only start accumulating from year 1)
    if (year > 0) {
      cumulativeBuyingCosts += yearlyBuyingCosts;
      cumulativeRentingCosts += yearlyRentingCosts;
    }

    // Use the wealth values directly from the results (they include tax for final year)
    let buyingWealth = buyingYearData.totalWealthBuying;
    let rentingWealth = rentingYearData.totalWealthRenting;

    // For the final year, ensure we're using after-tax values
    if (year === timeHorizonYears) {
      buyingWealth = buyingYearData.totalWealthBuying; // Should already include tax deduction
      rentingWealth = rentingYearData.totalWealthRenting; // Should already include tax deduction
    }

    yearlyComparisons.push({
      year,
      buyingWealth,
      rentingWealth,
      difference: buyingWealth - rentingWealth,
      cumulativeBuyingCosts,
      cumulativeRentingCosts,
      buyingLeftoverIncome: buyingYearData.yearlySavings,
      rentingLeftoverIncome: rentingYearData.yearlySavings,
      buyingLeftoverInvestmentValue: buyingYearData.investmentsWithEarnings,
      rentingLeftoverInvestmentValue: rentingYearData.investmentsWithEarnings,
    });
    finalInvestmentAmount = investmentAmount;
  }

  // --- Final Summary (FIXED) ---
  // Make sure we're using the final year's wealth AFTER taxes
  const finalBuyingWealth = buyingResults[timeHorizonYears].totalWealthBuying; // Already includes tax
  const finalRentingWealth = rentingResults[timeHorizonYears].totalWealthRenting; // Already includes tax
  const difference = finalBuyingWealth - finalRentingWealth;

  // Determine better option with reasonable threshold
  let betterOption: "buying" | "renting" | "equal" = "equal";
  const wealthThreshold = Math.max(finalBuyingWealth, finalRentingWealth) * 0.01; // 1% difference threshold

  if (difference > wealthThreshold) {
    betterOption = "buying";
  } else if (difference < -wealthThreshold) {
    betterOption = "renting";
  }

  // Ensure the values are valid numbers
  const validatedFinalBuyingWealth = isNaN(finalBuyingWealth) ? 0 : finalBuyingWealth;
  const validatedFinalRentingWealth = isNaN(finalRentingWealth) ? 0 : finalRentingWealth;
  const validatedDifference = isNaN(difference) ? 0 : Math.abs(difference);

  console.log({
    yearlyComparisons,
    buyingResults,
    rentingResults
  })

  return {
    yearlyComparisons,
    buyingResults,
    rentingResults,
    summary: {
      finalBuyingWealth: validatedFinalBuyingWealth,
      finalRentingWealth: validatedFinalRentingWealth,
      difference: validatedDifference,
      betterOption,
    },
    finalInvestmentAmount,
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
