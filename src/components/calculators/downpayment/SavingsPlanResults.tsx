import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface SavingsPlanResultsProps {
  downPaymentAmount: number;
  downPaymentPercent: number;
  homePrice: number;
  currentSavings: number;
  monthlySavingsNeeded: number;
  timelineYears: number;
  monthlyIncome: number;
}

const SavingsPlanResults: React.FC<SavingsPlanResultsProps> = ({
  downPaymentAmount,
  downPaymentPercent,
  homePrice,
  currentSavings,
  monthlySavingsNeeded,
  timelineYears,
  monthlyIncome,
}) => {
  const monthlyMoneyLeft = monthlyIncome - monthlySavingsNeeded;
  const isNegative = monthlyMoneyLeft < 0;

  return (
    <Card>
      <CardHeader className="bg-muted">
        <CardTitle>Your Savings Plan</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Down Payment Goal</h3>
            <p className="text-3xl font-bold text-primary">{formatCurrency(downPaymentAmount)}</p>
            <p className="text-sm text-muted-foreground">
              {downPaymentPercent}% of {formatCurrency(homePrice)}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Current Savings</h3>
            <p className="text-2xl font-semibold">{formatCurrency(currentSavings)}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Amount Needed</h3>
            <p className="text-2xl font-semibold">{formatCurrency(downPaymentAmount - currentSavings)}</p>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="text-lg font-medium">Monthly Savings Needed</h3>
            <p className="text-4xl font-bold text-primary">{formatCurrency(monthlySavingsNeeded)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Over {timelineYears} {timelineYears === 1 ? 'year' : 'years'} ({timelineYears * 12} months)
            </p>
          </div>

          <div className={cn(
            "p-4 rounded-lg border",
            isNegative
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          )}>
            <h3 className={cn(
              "text-lg font-medium",
              isNegative ? "text-red-800" : "text-green-800"
            )}>
              Monthly Income Breakdown
            </h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between items-center">
                <span className={cn(
                  "text-sm",
                  isNegative ? "text-red-700" : "text-green-700"
                )}>
                  Monthly Income (Post Tax):
                </span>
                <span className={cn(
                  "font-medium",
                  isNegative ? "text-red-800" : "text-green-800"
                )}>
                  {formatCurrency(monthlyIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={cn(
                  "text-sm",
                  isNegative ? "text-red-700" : "text-green-700"
                )}>
                  Required Monthly Savings:
                </span>
                <span className={cn(
                  "font-medium",
                  isNegative ? "text-red-800" : "text-green-800"
                )}>
                  -{formatCurrency(monthlySavingsNeeded)}
                </span>
              </div>
              <div className={cn(
                "border-t pt-2 mt-2",
                isNegative ? "border-red-200" : "border-green-200"
              )}>
                <div className="flex justify-between items-center">
                  <span className={cn(
                    "text-sm font-medium",
                    isNegative ? "text-red-800" : "text-green-800"
                  )}>
                    Monthly Money Left:
                  </span>
                  <span className={cn(
                    "font-bold",
                    isNegative ? "text-red-800" : "text-green-800"
                  )}>
                    {formatCurrency(monthlyMoneyLeft)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Assumptions</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>S&P 500 average annual return: 10%</li>
              <li>Monthly compounding of returns</li>
              <li>Consistent monthly contributions</li>
              <li>Capital gains tax applied only at the end when selling investments</li>
              <li>Final balance accounts for taxes to ensure sufficient down payment after tax</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
            <p className="text-xs text-yellow-700 mt-1">
              This calculator provides an estimate based on historical average returns.
              Actual investment performance may vary. Past performance is not a guarantee of future results.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsPlanResults;
