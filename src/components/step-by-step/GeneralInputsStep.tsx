import React, { useState } from "react";
import { GeneralInputs, FormData } from "@/lib/types";
import StepContainer from "./StepContainer";
import CurrencyInput from "@/components/forms/CurrencyInput";
import SliderInput from "@/components/forms/SliderInput";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import PercentageInput from "@/components/forms/PercentageInput";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

interface GeneralInputsStepProps {
  values: GeneralInputs;
  onChange: (values: GeneralInputs) => void;
  formData: FormData;
  validationError: string | null;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
  currentStep: string;
}

const GeneralInputsStep: React.FC<GeneralInputsStepProps> = ({
  values,
  onChange,
  formData,
  validationError,
  onNext,
  onPrevious,
  canProceed,
  currentStep,
}) => {
  const [isYearlyIncome, setIsYearlyIncome] = React.useState(false);
  const hasSavingsError = validationError?.toLowerCase().includes('current savings');

  const handleIncomeChange = (income: number) => {
    const annualIncome = isYearlyIncome ? income : income * 12;
    onChange({ ...values, annualIncome });
  };

  const handleIncomeIncreaseToggle = () => {
    onChange({
      ...values,
      incomeIncrease: !values.incomeIncrease,
    });
  };

  const handleAnnualIncomeGrowthChange = (annualIncomeGrowthRate: number) => {
    onChange({ ...values, annualIncomeGrowthRate });
  };

  const handleCurrentSavingsChange = (currentSavings: number) => {
    onChange({ ...values, currentSavings });
  };

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  return (
    <StepContainer
      currentStep={currentStep as any}
      totalSteps={4}
      stepNumber={4}
      title="General Information"
      description="Let's start with some basic information about your financial situation."
      onNext={onNext}
      onPrevious={onPrevious}
      canProceed={canProceed}
      validationError={validationError}
      isLastStep={true}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <CurrencyInput
            id="currentSavings"
            label={
              <div className="flex items-center gap-2">
                <span>Current Savings</span>
                {hasSavingsError && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            }
            value={values.currentSavings}
            onChange={handleCurrentSavingsChange}
            description="Your total current savings"
            className={hasSavingsError ? "border-red-300 focus-visible:ring-red-500" : ""}
          />

          <SliderInput
            id="downPaymentPercent"
            label="Down Payment"
            min={0}
            max={100}
            step={1}
            value={values.downPaymentPercent}
            onChange={(downPaymentPercent) => onChange({ ...values, downPaymentPercent })}
            valueDisplay={formData ? `${values.downPaymentPercent}% (${(formData.buying.housePrice * (values.downPaymentPercent / 100)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })})` : `${values.downPaymentPercent}%`}
            description="The down payment as a percentage of the house price"
          />

          {formData && (
            <div className="text-sm text-muted-foreground mt-1">
              <a 
                href="/down-payment-calculator" 
                className="text-primary hover:text-primary/80 underline flex items-center"
              >
                <span>Need help saving for your down payment?</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </a>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="incomeMode"
                checked={isYearlyIncome}
                onCheckedChange={setIsYearlyIncome}
              />
              <Label htmlFor="incomeMode">Use annual income</Label>
            </div>
          </div>

          <CurrencyInput
            id="income"
            label={isYearlyIncome ? "Annual Income (Post Tax)" : "Monthly Income (Post Tax)"}
            value={isYearlyIncome ? values.annualIncome : values.annualIncome / 12}
            onChange={handleIncomeChange}
            description={`Your gross ${isYearlyIncome ? 'annual' : 'monthly'} income`}
          />

          <CurrencyInput
            id="monthlyExpenses"
            label="Monthly Expenses (Optional)"
            value={values.monthlyExpenses || 0}
            onChange={(expenses) => onChange({ ...values, monthlyExpenses: expenses })}
            description="Your total monthly expenses (e.g., utilities, food, transportation)"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="incomeIncrease"
            checked={values.incomeIncrease}
            onCheckedChange={handleIncomeIncreaseToggle}
          />
          <Label htmlFor="incomeIncrease">Include annual income increase</Label>
        </div>

        {values.incomeIncrease && (
          <PercentageInput
            id="annualIncomeGrowthRate"
            label="Annual Income Growth"
            value={values.annualIncomeGrowthRate}
            onChange={handleAnnualIncomeGrowthChange}
            description="The expected annual percentage increase in your income"
            min={0}
            max={20}
          />
        )}
      </div>
    </StepContainer>
  );
};

export default GeneralInputsStep;
