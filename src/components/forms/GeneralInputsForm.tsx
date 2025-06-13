import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { FormData, GeneralInputs } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import CurrencyInput from "./CurrencyInput";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import PercentageInput from "./PercentageInput";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";

interface GeneralInputsFormProps {
  values: GeneralInputs;
  onChange: (values: GeneralInputs) => void;
  formData?: FormData; 
  validationError?: string | null;
}

const GeneralInputsForm = ({ 
  values, 
  onChange, 
  validationError 
}: GeneralInputsFormProps) => {
  const hasSavingsError = validationError?.toLowerCase().includes('current savings');

  const [isYearlyIncome, setIsYearlyIncome] = useState(false);

  const handleIncomeChange = (income: number) => {
    const annualIncome = isYearlyIncome ? income : income * 12;
    onChange({ ...values, annualIncome });
  };

  const handleAnnualIncomeGrowthChange = (annualIncomeGrowthRate: number) => {
    onChange({ ...values, annualIncomeGrowthRate });
  };

  const handleCurrentSavingsChange = (currentSavings: number) => {
    onChange({ ...values, currentSavings });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-0">
        <div className="grid gap-4">
          <div className="flex items-center space-x-2 p-2 rounded-md bg-muted/50 border">
            <Checkbox
              id="useIncomeAndSavings"
              checked={values.useIncomeAndSavings}
              onCheckedChange={(checked) => {
                onChange({ ...values, useIncomeAndSavings: !!checked });
              }}
            />
            <Label 
              htmlFor="useIncomeAndSavings" 
              className="font-medium text-sm cursor-pointer"
            >
              Use Personal Income & Savings
            </Label>
          </div>

          {values.useIncomeAndSavings && (
            <Accordion type="multiple" className="w-full" defaultValue={['income-expenses']}>
              <AccordionItem value="income-expenses">
                <AccordionTrigger>Income & Expenses</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
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
                      description="Your total current savings for a down payment and other investments"
                      className={hasSavingsError ? "border-red-300 focus-visible:ring-red-500" : ""}
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="incomeMode"
                        checked={isYearlyIncome}
                        onCheckedChange={setIsYearlyIncome}
                      />
                      <Label htmlFor="incomeMode">Use annual income</Label>
                    </div>
                    <CurrencyInput
                      id="income"
                      label={isYearlyIncome ? "Annual Income (Post Tax)" : "Monthly Income (Post Tax)"}
                      value={values.annualIncome ? (isYearlyIncome ? values.annualIncome : values.annualIncome / 12) : 0}
                      onChange={handleIncomeChange}
                      description={`Your gross ${isYearlyIncome ? 'annual' : 'monthly'} income`}
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="incomeIncrease"
                        checked={values.incomeIncrease}
                        onCheckedChange={() => onChange({ ...values, incomeIncrease: !values.incomeIncrease })}
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
                    <CurrencyInput
                      id="monthlyExpenses"
                      label="Other Monthly Expenses"
                      value={values.monthlyExpenses || 0}
                      onChange={(expenses) => onChange({ ...values, monthlyExpenses: expenses })}
                      description="Your total non-housing monthly expenses (e.g., food, transportation)"
                    />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralInputsForm;