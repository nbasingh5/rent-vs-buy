import { useState, useEffect } from "react";
import { BuyingInputs, ComparisonResults, FormData, GeneralInputs, InvestmentInputs, RentingInputs } from "@/lib/types";
import { calculateComparison } from "@/lib/calculations";
import { toast } from "@/components/ui/use-toast";

// Default form values
const defaultGeneral: GeneralInputs = {
  timeHorizon: 30,
  annualIncome: 72000,
  incomeIncrease: false,
  annualIncomeGrowthRate: 3,
  currentSavings: 80000,
  downPaymentPercent: 20,
};

const defaultBuying: BuyingInputs = {
  housePrice: 400000,
  interestRate: 6,
  loanTerm: 30,
  loanType: "fixed",
  propertyTaxRate: 1.2,
  homeInsuranceRate: 0.5,
  maintenanceCosts: 1,
  usePercentageForMaintenance: true,
  appreciationScenario: "medium",
  customAppreciationRate: 4,
  currentSavings: 80000,
  downPaymentPercent: 20,
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

  // Run initial validation on mount
  useEffect(() => {
    validateSavingsForDownPayment(
      formData.buying.currentSavings,
      formData.buying.housePrice,
      formData.buying.downPaymentPercent
    );
  }, []);

  // Validation function
  const validateSavingsForDownPayment = (
    currentSavings: number,
    housePrice: number,
    downPaymentPercent: number
  ) => {
    const downPaymentAmount = housePrice * (downPaymentPercent / 100);
    if (currentSavings < downPaymentAmount) {
      setValidationError(`Your current savings ($${currentSavings.toLocaleString()}) are less than the required down payment ($${downPaymentAmount.toLocaleString()})`);
      return false;
    } else {
      setValidationError(null);
      return true;
    }
  };

  // Form update handlers
  const handleGeneralChange = (general: GeneralInputs) => {
    setFormData({ ...formData, general });

    // Validate if current savings or down payment percent changed
    if (general.currentSavings !== formData.general.currentSavings ||
      general.downPaymentPercent !== formData.general.downPaymentPercent) {
      validateSavingsForDownPayment(
        general.currentSavings,
        formData.buying.housePrice,
        general.downPaymentPercent
      );
    }
  };

  const handleBuyingChange = (buying: BuyingInputs) => {
    setFormData({ ...formData, buying });

    // Validate if house price or down payment percent changed
    if (buying.currentSavings !== formData.general.currentSavings ||
      buying.downPaymentPercent !== formData.general.downPaymentPercent) {
      validateSavingsForDownPayment(
        buying.currentSavings,
        formData.buying.housePrice,
        buying.downPaymentPercent
      );
    }
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
    // Calculate down payment amount
    const downPaymentAmount = formData.buying.housePrice * (formData.general.downPaymentPercent / 100);

    // Check if current savings are less than down payment
    if (formData.general.currentSavings < downPaymentAmount) {
      setValidationError(`Your current savings ($${formData.general.currentSavings.toLocaleString()}) are less than the required down payment ($${downPaymentAmount.toLocaleString()})`);

      // Show toast notification
      toast({
        title: "Insufficient Savings",
        description: `You need at least $${downPaymentAmount.toLocaleString()} for the down payment.`,
        variant: "destructive"
      });

      return;
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
    console.log
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
        setCurrentStep('general');
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
    if (currentStep === 'general') {
      return validateSavingsForDownPayment(
        formData.general.currentSavings,
        formData.buying.housePrice,
        formData.general.downPaymentPercent
      );
    }
    if (currentStep === 'buying') {
      return validateSavingsForDownPayment(
        formData.buying.currentSavings,
        formData.buying.housePrice,
        formData.buying.downPaymentPercent
      );
    }
    return true;
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
