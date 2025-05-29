import {
  BuyingInputs,
  InvestmentInputs,
  MonthlyBuyingDataPoint,
  YearlyBuyingResult,
} from "../types";
import { getAppreciationRate } from "./propertyUtils";
import {
  calculateMortgageAmortizationForMonth,
} from "./mortgageUtils";
import {
  calculateMonthlyPropertyTaxes,
  calculateMonthlyHomeInsurance,
  calculateMonthlyMaintenanceCosts,
} from "./propertyCostUtils";
import { calculateCapitalGainsTax } from "./investmentUtils";

interface BuyingCalculationInputs {
  buying: BuyingInputs;
  investment: InvestmentInputs;
}

interface BuyingCalculationResult {
  buyingResults: YearlyBuyingResult[];
}

export const calculateBuyingYearlyData = ({
  buying,
  investment,
}: BuyingCalculationInputs): BuyingCalculationResult => {
  const appreciationRate = getAppreciationRate(buying) / 100;

  // Initial values
  const downPaymentAmount = buying.housePrice * (buying.downPaymentPercent / 100);
  const loanAmount = buying.housePrice - downPaymentAmount;
  const initialHomeValue = buying.housePrice;

  const buyingResults: YearlyBuyingResult[] = [];
  const monthlyBuyingData: Record<number, MonthlyBuyingDataPoint[]> = {};

  // Initialize tracking variables
  let currentHomeValue = initialHomeValue;
  let initialInvestment = Math.max(0, buying.currentSavings - downPaymentAmount);

  // --- Year 0 Setup ---
  monthlyBuyingData[0] = [];
  for (let month = 1; month <= 12; month++) {
    monthlyBuyingData[0].push({
      month,
      homeValue: initialHomeValue,
      homeEquity: downPaymentAmount,
      loanBalance: loanAmount,
      mortgagePayment: 0,
      principalPayment: 0, 
      interestPayment: 0,
      propertyTaxes: 0,
      homeInsurance: 0,
      maintenanceCosts: 0,
      amountInvested: initialInvestment,
      investmentEarnings: 0,
      yearlySavings: 0,
      investmentsWithEarnings: initialInvestment, 
      totalWealthBuying: downPaymentAmount + initialInvestment,
      monthlyExpenses: 0
    });
  }

    buyingResults.push({
      year: 0,
      mortgagePayment: 0,
      principalPaid: downPaymentAmount,
      interestPaid: 0,
      loanBalance: loanAmount,
      propertyTaxes: 0,
      homeInsurance: 0,
      maintenanceCosts: 0,
      homeValue: initialHomeValue,
      homeEquity: downPaymentAmount,
      totalWealthBuying: downPaymentAmount + initialInvestment,
      yearlySavings: 0,
      investmentsWithEarnings: initialInvestment,
      amountInvested: initialInvestment,
      investmentEarnings: 0,
      monthlyData: monthlyBuyingData[0],
      capitalGainsTaxPaid: 0,
    });
  // --- End Year 0 Setup ---

  // Calculate for each year
  for (let year = 1; year <= buying.loanTerm; year++) {
    monthlyBuyingData[year] = [];
    let yearlyMortgagePayment = 0;
    let yearlyPrincipalPaid = 0;
    let yearlyInterestPaid = 0;
    let yearlyPropertyTaxes = 0;
    let yearlyHomeInsurance = 0;
    let yearlyMaintenanceCosts = 0;
    let yearlyLeftoverIncome = 0;

    // Get previous year's data
    const previousYear = buyingResults[year - 1];
    let currentHomeEquity = previousYear.homeEquity;
    let investmentsWithEarnings = previousYear.investmentsWithEarnings;

    for (let month = 1; month <= 12; month++) {
      const globalMonthNumber = (year - 1) * 12 + month;

      const { principalPayment, interestPayment, remainingBalance } =
        calculateMortgageAmortizationForMonth(
          loanAmount,
          buying.interestRate,
          buying.loanTerm,
          globalMonthNumber
        );

      const monthlyPropertyTaxes = calculateMonthlyPropertyTaxes(
        currentHomeValue,
        buying.propertyTaxRate
      );
      const monthlyHomeInsurance = calculateMonthlyHomeInsurance(
        currentHomeValue,
        buying.homeInsuranceRate
      );
      const monthlyMaintenanceCosts = calculateMonthlyMaintenanceCosts(
        currentHomeValue,
        buying.maintenanceCosts,
        buying.usePercentageForMaintenance
      );

      // Calculate monthly mortgage payment (principal + interest)
      const mortgagePayment = principalPayment + interestPayment;

      const monthlyExpenses = 
        mortgagePayment + 
        monthlyPropertyTaxes +
        monthlyHomeInsurance +
        monthlyMaintenanceCosts

      // Track yearly totals
      yearlyMortgagePayment += mortgagePayment;
      yearlyPrincipalPaid += principalPayment;
      yearlyInterestPaid += interestPayment;
      yearlyPropertyTaxes += monthlyPropertyTaxes;
      yearlyHomeInsurance += monthlyHomeInsurance;
      yearlyMaintenanceCosts += monthlyMaintenanceCosts;
      
      // Apply monthly home appreciation
      const monthlyAppreciationRate = Math.pow(1 + appreciationRate, 1 / 12) - 1;
      currentHomeValue *= 1 + monthlyAppreciationRate;

      currentHomeEquity = currentHomeValue - remainingBalance;

      // Store monthly data point 
      monthlyBuyingData[year].push({
        month,
        homeValue: currentHomeValue,
        homeEquity: currentHomeEquity,
        loanBalance: remainingBalance,
        mortgagePayment,
        principalPayment,
        interestPayment,
        propertyTaxes: monthlyPropertyTaxes,
        homeInsurance: monthlyHomeInsurance,
        maintenanceCosts: monthlyMaintenanceCosts,
        amountInvested: 0,
        investmentEarnings: 0,
        investmentsWithEarnings,
        yearlySavings: 0,
        totalWealthBuying: currentHomeEquity + investmentsWithEarnings,
        monthlyExpenses
      });
    } // End monthly loop

    const totalWealth = currentHomeEquity + investmentsWithEarnings;
    // Add year results
    buyingResults.push({
      year,
      mortgagePayment: yearlyMortgagePayment,
      principalPaid: yearlyPrincipalPaid,
      interestPaid: yearlyInterestPaid,
      loanBalance: monthlyBuyingData[year][11].loanBalance,
      propertyTaxes: yearlyPropertyTaxes,
      homeInsurance: yearlyHomeInsurance,
      maintenanceCosts: yearlyMaintenanceCosts,
      homeValue: currentHomeValue,
      homeEquity: currentHomeEquity,
      totalWealthBuying: totalWealth,
      yearlySavings: yearlyLeftoverIncome,
      investmentsWithEarnings,
      amountInvested: 0,
      investmentEarnings: 0,
      monthlyData: monthlyBuyingData[year],
      capitalGainsTaxPaid: 0,
    });
  } // End yearly loop

  return {
    buyingResults
  };
};
