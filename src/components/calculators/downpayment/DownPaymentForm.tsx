import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SliderInput from "@/components/forms/SliderInput";
import PercentageInput from "@/components/forms/PercentageInput";
import { formatCurrency } from "@/lib/utils/formatters";

interface DownPaymentFormProps {
  incomeType: 'annual' | 'monthly';
  income: number;
  homePrice: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  timelineYears: number;
  currentSavings: number;
  annualReturnRate: number;
  capitalGainsTaxRate: number;
  onIncomeTypeChange: (type: 'annual' | 'monthly') => void;
  onIncomeChange: (value: number) => void;
  onHomePriceChange: (value: number) => void;
  onDownPaymentPercentChange: (value: number) => void;
  onTimelineYearsChange: (value: number) => void;
  onCurrentSavingsChange: (value: number) => void;
  onAnnualReturnChange: (value: number) => void;
  onCapitalGainsTaxRateChange: (value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DownPaymentForm: React.FC<DownPaymentFormProps> = ({
  incomeType,
  income,
  homePrice,
  downPaymentPercent,
  downPaymentAmount,
  timelineYears,
  currentSavings,
  annualReturnRate,
  capitalGainsTaxRate,
  onIncomeTypeChange,
  onIncomeChange,
  onHomePriceChange,
  onDownPaymentPercentChange,
  onTimelineYearsChange,
  onCurrentSavingsChange,
  onAnnualReturnChange,
  onCapitalGainsTaxRateChange,
  onSubmit
}) => {
  // Utility function to parse currency string to number
  const parseCurrency = (value: string): number => {
    return parseFloat(value.replace(/[$,]/g, '')) || 0;
  };

  // Handle currency input changes
  const handleCurrencyChange = (value: string, setter: (num: number) => void) => {
    const numericValue = parseCurrency(value);
    setter(numericValue);
  };

  return (
    <Card>
      <CardHeader className="bg-muted">
        <CardTitle>Down Payment Calculator</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="income">{incomeType === 'annual' ? 'Annual' : 'Monthly'} Income (Post tax)</Label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className={`px-3 py-1 text-sm rounded-md ${incomeType === 'monthly' ? 'bg-primary text-white' : 'bg-muted'}`}
                  onClick={() => {
                    if (incomeType === 'annual') {
                      onIncomeTypeChange('monthly');
                      onIncomeChange(income / 12);
                    }
                  }}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 text-sm rounded-md ${incomeType === 'annual' ? 'bg-primary text-white' : 'bg-muted'}`}
                  onClick={() => {
                    if (incomeType === 'monthly') {
                      onIncomeTypeChange('annual');
                      onIncomeChange(income * 12);
                    }
                  }}
                >
                  Annual
                </button>
              </div>
            </div>
            <Input
              id="income"
              type="text"
              value={formatCurrency(income)}
              onChange={(e) => handleCurrencyChange(e.target.value, onIncomeChange)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="homePrice">Home Price</Label>
            <Input
              id="homePrice"
              type="text"
              value={formatCurrency(homePrice)}
              onChange={(e) => handleCurrencyChange(e.target.value, onHomePriceChange)}
              required
            />
          </div>

          <SliderInput
            id="downPaymentPercent"
            label="Down Payment"
            min={0}
            max={100}
            step={1}
            value={downPaymentPercent}
            onChange={onDownPaymentPercentChange}
            valueDisplay={`${downPaymentPercent}% (${formatCurrency(downPaymentAmount)})`}
            description="The down payment as a percentage of the house price"
          />

          <div className="space-y-2">
            <Label htmlFor="timelineYears">Timeline (Years)</Label>
            <Input
              id="timelineYears"
              type="number"
              value={timelineYears}
              onChange={(e) => onTimelineYearsChange(Number(e.target.value))}
              min="1"
              max="30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentSavings">Current Savings</Label>
            <Input
              id="currentSavings"
              type="text"
              value={formatCurrency(currentSavings)}
              onChange={(e) => handleCurrencyChange(e.target.value, onCurrentSavingsChange)}
              required
            />
          </div>

          <div className="space-y-2">
            <PercentageInput
              id="annualReturn"
              label="S&P 500 Annual Return"
              value={annualReturnRate}
              onChange={onAnnualReturnChange}
              description="The expected annual return on S&P 500 investments"
              min={0}
              max={30}
            />
          </div>

          <div className="space-y-2">
            <PercentageInput
              id="capitalGainsTaxRate"
              label="Capital Gains Tax Rate"
              value={capitalGainsTaxRate}
              onChange={onCapitalGainsTaxRateChange}
              description="The tax rate on investment gains"
              min={0}
            />
          </div>

          <Button type="submit" className="w-full">Calculate Monthly Savings</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DownPaymentForm;
