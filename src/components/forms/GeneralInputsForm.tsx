
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FormData, GeneralInputs } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import CurrencyInput from "./CurrencyInput";
import SliderInput from "./SliderInput";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import PercentageInput from "./PercentageInput";

interface GeneralInputsFormProps {
  values: GeneralInputs;
  onChange: (values: GeneralInputs) => void;
  formData?: FormData; // Optional full form data for validation
  validationError?: string | null; // Optional validation error
}

const GeneralInputsForm = ({ 
  values, 
  onChange, 
  formData, 
  validationError 
}: GeneralInputsFormProps) => {
  // Check if there's a validation error related to current savings
  const hasSavingsError = validationError?.toLowerCase().includes('current savings');
  const handleTimeHorizonChange = (timeHorizon: number) => {
    onChange({ ...values, timeHorizon });
  };

  const [isYearlyIncome, setIsYearlyIncome] = useState(false);

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

  return (
    <Card>
      <CardHeader className="bg-muted">
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          <SliderInput
            id="timeHorizon"
            label="Time Horizon (Years)"
            min={1}
            max={30}
            step={1}
            value={values.timeHorizon}
            onChange={handleTimeHorizonChange}
            description="The number of years for the comparison"
          />
          
          <Separator />
          
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
              value={isYearlyIncome ?  values.annualIncome : values.annualIncome / 12}
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
          
          <Separator />
          
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
            
            {hasSavingsError && (
              <p className="text-sm text-red-500 mt-1">
                {validationError}
              </p>
            )}

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
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralInputsForm;
