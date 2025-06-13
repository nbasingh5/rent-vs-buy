import {
  RentingInputs,
  MonthlyRentingDataPoint,
  YearlyRentingResult,
} from "../types";

interface RentingCalculationInputs {
  renting: RentingInputs;
  loanTerm: number; // Changed from 'general' to 'loanTerm'
}

interface RentingCalculationResult {
  rentingResults: YearlyRentingResult[];
}

export const calculateRentingYearlyData = ({
  renting,
  loanTerm
}: RentingCalculationInputs): RentingCalculationResult => {
  const rentingResults: YearlyRentingResult[] = [];
  let monthlyRent = renting.monthlyRent;

  // Year 0
  rentingResults.push({
    year: 0,
    totalRent: 0,
    totalWealthRenting: 0, // Engine will calculate
    amountInvested: 0,
    investmentEarnings: 0,
    investmentsWithEarnings: 0,
    capitalGainsTaxPaid: 0,
    monthlyData: Array(12).fill(null).map((_, i) => ({
      month: i + 1,
      rent: 0,
      amountInvested: 0,
      investmentEarnings: 0,
      investmentsWithEarnings: 0,
      totalWealthRenting: 0,
      capitalGainsTax: 0,
    }))
  });

  for (let year = 1; year <= loanTerm; year++) {
    const monthlyData: MonthlyRentingDataPoint[] = [];
    let yearlyRent = 0;

    for (let month = 1; month <= 12; month++) {
      yearlyRent += monthlyRent;
      monthlyData.push({
        month,
        rent: monthlyRent,
        // Investment fields populated by the engine
        amountInvested: 0,
        investmentEarnings: 0,
        investmentsWithEarnings: 0,
        totalWealthRenting: 0,
        capitalGainsTax: 0,
      });
    }

    rentingResults.push({
      year,
      totalRent: yearlyRent,
      // Investment fields populated by the engine
      totalWealthRenting: 0,
      amountInvested: 0,
      investmentEarnings: 0,
      investmentsWithEarnings: 0,
      capitalGainsTaxPaid: 0,
      monthlyData: monthlyData,
    });

    // Increase rent for the next year
    monthlyRent *= 1 + renting.annualRentIncrease / 100;
  }

  return {
    rentingResults,
  };
};