import { useState, useEffect } from "react";
import { BuyingInputs, ComparisonResults, FormData, GeneralInputs, InvestmentInputs, RentingInputs } from "@/lib/types";
import { calculateComparison } from "@/lib/calculations";
import { toast } from "@/components/ui/use-toast";

// Default form values
const defaultGeneral: GeneralInputs = {
  useIncomeAndSavings: false,
  annualIncome: 0,
  incomeIncrease: false,
  annualIncomeGrowthRate: 3,
  currentSavings: 0,
  monthlyExpenses: 0,
};

const defaultBuying: BuyingInputs = {
  housePrice: 400000,
  downPaymentPercent: 20,
  interestRate: 6,
  loanTerm: 30,
  loanType: "fixed",
  propertyTaxRate: 1.2,
  homeInsuranceRate: 0.5,
  maintenanceCosts: 1,
  usePercentageForMaintenance: true,
  appreciationScenario: "medium",
  customAppreciationRate: 4,
};

const defaultRenting: RentingInputs = {
  monthlyRent: 2000,
  annualRentIncrease: 3,
};

const defaultInvestment: InvestmentInputs = {
  annualReturn: 10,
  capitalGainsTaxRate: 15,
};

export const useRentBuyCalculator = () => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    general: defaultGeneral,
    buying: defaultBuying,
    renting: defaultRenting,
    investment: defaultInvestment,
  });

  // Results state
  const [results, setResults] = useState<ComparisonResults | null>(null);
  
  // Validation state
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Validation function
  const validateSavingsForDownPayment = (
    usePersonalSavings: boolean,
    currentSavings: number, 
    housePrice: number, 
    downPaymentPercent: number
  ) => {
    // Only validate if user has opted into using their personal savings
    if (!usePersonalSavings) {
      setValidationError(null);
      return;
    }
    
    const downPaymentAmount = housePrice * (downPaymentPercent / 100);
    if (currentSavings < downPaymentAmount) {
      setValidationError(`Your current savings ($${currentSavings.toLocaleString()}) are less than the required down payment ($${downPaymentAmount.toLocaleString()})`);
    } else {
      setValidationError(null);
    }
  };
  
  // Run validation whenever relevant fields change
  useEffect(() => {
    validateSavingsForDownPayment(
      formData.general.useIncomeAndSavings,
      formData.general.currentSavings,
      formData.buying.housePrice,
      formData.buying.downPaymentPercent
    );
  }, [
    formData.general.useIncomeAndSavings, 
    formData.general.currentSavings, 
    formData.buying.housePrice, 
    formData.buying.downPaymentPercent
  ]);
  
  // Form update handlers
  const handleGeneralChange = (general: GeneralInputs) => {
    setFormData({ ...formData, general });
  };
  
  const handleBuyingChange = (buying: BuyingInputs) => {
    setFormData({ ...formData, buying });
  };
  
  const handleRentingChange = (renting: RentingInputs) => {
    setFormData({ ...formData, renting });
  };
  
  const handleInvestmentChange = (investment: InvestmentInputs) => {
    setFormData({ ...formData, investment });
  };
  
  // Reset form to defaults
  const handleReset = () => {
    setFormData({
      general: defaultGeneral,
      buying: defaultBuying,
      renting: defaultRenting,
      investment: defaultInvestment,
    });
    setResults(null);
    setValidationError(null);
  };
  
  // Calculate results
  const handleCalculate = () => {
    if (formData.general.useIncomeAndSavings) {
      const downPaymentAmount = formData.buying.housePrice * (formData.buying.downPaymentPercent / 100);
      if (formData.general.currentSavings < downPaymentAmount) {
        toast({
          title: "Insufficient Savings",
          description: `You need at least $${downPaymentAmount.toLocaleString()} for the down payment.`,
          variant: "destructive"
        });
        return;
      }
    }
    
    // Proceed with calculation
    const calculationResults = calculateComparison(formData);
    setResults(calculationResults);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return {
    formData,
    results,
    validationError,
    handleGeneralChange,
    handleBuyingChange,
    handleRentingChange,
    handleInvestmentChange,
    handleReset,
    handleCalculate
  };
};