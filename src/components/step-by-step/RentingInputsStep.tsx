import React, { useState } from "react";
import { RentingInputs } from "@/lib/types";
import StepContainer from "./StepContainer";
import CurrencyInput from "@/components/forms/CurrencyInput";
import PercentageInput from "@/components/forms/PercentageInput";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RentingInputsStepProps {
  values: RentingInputs;
  onChange: (values: RentingInputs) => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
  currentStep: string;
}

const RentingInputsStep: React.FC<RentingInputsStepProps> = ({
  values,
  onChange,
  onNext,
  onPrevious,
  canProceed,
  currentStep,
}) => {
  const handleMonthlyRentChange = (monthlyRent: number) => {
    onChange({ ...values, monthlyRent });
  };

  const handleAnnualRentIncreaseChange = (annualRentIncrease: number) => {
    onChange({ ...values, annualRentIncrease });
  };

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  return (
    <StepContainer
      currentStep={currentStep as any}
      totalSteps={4}
      stepNumber={3}
      title="Renting Scenario"
      description="Tell us about your rental situation."
      onNext={onNext}
      onPrevious={onPrevious}
      canProceed={canProceed}
    >
      <div className="space-y-6">
        {/* Main required input */}
        <CurrencyInput
          id="monthlyRent"
          label="Monthly Rent"
          value={values.monthlyRent}
          onChange={handleMonthlyRentChange}
          description="Your current or expected monthly rent payment"
        />

        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-md font-medium mb-2">Annual Rent Cost</h3>
          <p className="text-2xl font-bold text-rent-dark">
            ${(values.monthlyRent * 12).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Based on your current monthly rent of ${values.monthlyRent.toLocaleString()} per month
          </p>
        </div>

        <Separator />

        {/* Advanced options toggle */}
        <div 
          className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-50 rounded-md"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
          <h3 className="text-lg font-medium">Advanced Options</h3>
          {showAdvancedOptions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>

        {/* Advanced options content */}
        {showAdvancedOptions && (
          <div className="space-y-6 pl-2 border-l-2 border-gray-200">
            <PercentageInput
              id="annualRentIncrease"
              label="Annual Rent Increase"
              value={values.annualRentIncrease}
              onChange={handleAnnualRentIncreaseChange}
              description="The expected annual percentage increase in your rent"
              min={0}
              max={20}
              step={0.1}
            />
          </div>
        )}
      </div>
    </StepContainer>
  );
};

export default RentingInputsStep;
