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

export type Step = 'general' | 'buying' | 'renting' | 'investment' | 'results';

export const useStepByStepCalculator = () => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    general: defaultGeneral,
    buying: defaultBuying,
    renting: defaultRenting,
    investment: defaultInvestment,
  });

  // Step state
  const [currentStep, setCurrentStep] = useState<Step>('buying');

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
    if (!usePersonalSavings) {
      setValidationError(null);
      return true;
    }
    const downPaymentAmount = housePrice * (downPaymentPercent / 100);
    if (currentSavings < downPaymentAmount) {
      setValidationError(`Your current savings ($${currentSavings.toLocaleString()}) are less than the required down payment ($${downPaymentAmount.toLocaleString()})`);
      return false;
    } else {
      setValidationError(null);
      return true;
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
    setCurrentStep('buying');
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

    // Clear any previous validation errors
    setValidationError(null);

    // Proceed with calculation
    const calculationResults = calculateComparison(formData);
    setResults(calculationResults);

    // Move to results step
    setCurrentStep('results');
  };

  // Navigation functions
  const goToNextStep = () => {
    switch (currentStep) {
      case 'buying':
        setCurrentStep('renting');
        break;
      case 'renting':
        setCurrentStep('investment');
        break;
      case 'investment':
        setCurrentStep('general');
        break;
      case 'general':
        handleCalculate();
        break;
      default:
        break;
    }
  };

  const goToPreviousStep = () => {
    switch (currentStep) {
      case 'buying':
        // No previous step from buying in this flow
        break;
      case 'renting':
        setCurrentStep('buying');
        break;
      case 'investment':
        setCurrentStep('renting');
        break;
      case 'general':
        setCurrentStep('investment')
        break;
      case 'results':
        setCurrentStep('general');
        break;
      default:
        break;
    }
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  // Check if can proceed to next step
  const canProceedToNextStep = (): boolean => {
    const { general, buying } = formData;
    return validateSavingsForDownPayment(
      general.useIncomeAndSavings,
      general.currentSavings,
      buying.housePrice,
      buying.downPaymentPercent
    );
  };
  
  return {
    formData,
    currentStep,
    results,
    validationError,
    handleGeneralChange,
    handleBuyingChange,
    handleRentingChange,
    handleInvestmentChange,
    handleReset,
    handleCalculate,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    canProceedToNextStep
  };
};