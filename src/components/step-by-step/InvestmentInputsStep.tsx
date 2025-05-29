import React, { useState } from "react";
import { InvestmentInputs } from "@/lib/types";
import StepContainer from "./StepContainer";
import PercentageInput from "@/components/forms/PercentageInput";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";

interface InvestmentInputsStepProps {
  values: InvestmentInputs;
  onChange: (values: InvestmentInputs) => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
  currentStep: string;
}

const InvestmentInputsStep: React.FC<InvestmentInputsStepProps> = ({
  values,
  onChange,
  onNext,
  onPrevious,
  canProceed,
  currentStep,
}) => {
  const handleAnnualReturnChange = (annualReturn: number) => {
    onChange({ ...values, annualReturn });
  };

  const handleCapitalGainsTaxRateChange = (capitalGainsTaxRate: number) => {
    onChange({ ...values, capitalGainsTaxRate });
  };

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Calculate example values
  const beforeTaxValue = Math.round(10000 * Math.pow(1 + values.annualReturn / 100, 10));
  const afterTaxValue = Math.round(10000 + (beforeTaxValue - 10000) * (1 - values.capitalGainsTaxRate / 100));

  return (
    <StepContainer
      currentStep={currentStep as any}
      totalSteps={4}
      stepNumber={3}
      title="Investment Settings"
      description="Configure your investment assumptions for the comparison."
      onNext={onNext}
      onPrevious={onPrevious}
      canProceed={canProceed}
      // isLastStep={true}
    >
      <div className="space-y-6">
        {/* Main required input */}
        <PercentageInput
          id="annualReturn"
          label="Expected Annual Return"
          value={values.annualReturn}
          onChange={handleAnnualReturnChange}
          description="The expected annual return on your investments (e.g., stock market)"
          min={0}
          max={30}
          step={0.1}
        />

        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-md font-medium mb-2">Investment Growth Example</h3>
          <p className="text-sm text-muted-foreground">
            With a {values.annualReturn}% annual return, $10,000 invested today would grow to approximately ${beforeTaxValue.toLocaleString()} after 10 years before taxes.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            After paying {values.capitalGainsTaxRate}% capital gains tax on the earnings, you would have approximately ${afterTaxValue.toLocaleString()}.
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
              id="capitalGainsTaxRate"
              label="Capital Gains Tax Rate"
              value={values.capitalGainsTaxRate}
              onChange={handleCapitalGainsTaxRateChange}
              description="The tax rate applied to your investment gains"
              min={0}
              max={50}
              step={0.1}
            />
          </div>
        )}
      </div>
    </StepContainer>
  );
};

export default InvestmentInputsStep;
