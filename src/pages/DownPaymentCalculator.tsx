import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InfoCard from "@/components/layout/InfoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculateInvestmentReturnForMonth } from "@/lib/utils/investmentUtils";
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableFooter,
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";

const DownPaymentCalculator = () => {
  // State for form inputs
  const [annualIncome, setAnnualIncome] = useState<number>(100000);
  const [homePrice, setHomePrice] = useState<number>(500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [timelineYears, setTimelineYears] = useState<number>(5);
  const [currentSavings, setCurrentSavings] = useState<number>(10000);
  
  // State for calculation results
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(0);
  const [monthlySavingsNeeded, setMonthlySavingsNeeded] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [investmentGrowthData, setInvestmentGrowthData] = useState<Array<{
    period: number;
    startingBalance: number;
    contribution: number;
    investmentReturn: number;
    endingBalance: number;
    totalContributions: number;
    totalReturns: number;
    monthlyData?: Array<{
      month: number;
      startingBalance: number;
      contribution: number;
      investmentReturn: number;
      endingBalance: number;
    }>;
  }>>([]);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  
  // Calculate down payment amount when home price or percentage changes
  useEffect(() => {
    const calculatedDownPayment = homePrice * (downPaymentPercent / 100);
    setDownPaymentAmount(calculatedDownPayment);
  }, [homePrice, downPaymentPercent]);
  
  // Handle form submission
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate how much needs to be saved
    const targetAmount = downPaymentAmount;
    const startingAmount = currentSavings;
    const monthsToSave = timelineYears * 12;
    
    // Assuming S&P 500 average annual return of 10%
    const annualReturnRate = 10;
    
    // Calculate monthly savings needed using compound interest formula
    let monthlySavings = 0;
    let currentTotal = startingAmount;
    
    // Iterative approach to find the monthly savings needed
    for (let month = 1; month <= monthsToSave; month++) {
      // Calculate investment return for the month
      const monthlyReturn = calculateInvestmentReturnForMonth(currentTotal, annualReturnRate);
      
      // Add the monthly savings and return to the total
      currentTotal += monthlySavings + monthlyReturn;
    }
    
    // Use binary search to find the right monthly savings amount
    let low = 0;
    let high = (targetAmount - startingAmount) / monthsToSave * 2; // Initial guess
    
    while (high - low > 1) {
      monthlySavings = (high + low) / 2;
      
      // Simulate savings growth
      currentTotal = startingAmount;
      for (let month = 1; month <= monthsToSave; month++) {
        const monthlyReturn = calculateInvestmentReturnForMonth(currentTotal, annualReturnRate);
        currentTotal += monthlySavings + monthlyReturn;
      }
      
      if (currentTotal > targetAmount) {
        high = monthlySavings;
      } else {
        low = monthlySavings;
      }
    }
    
    // Calculate investment growth data for the table
    const growthData = [];
    let balance = startingAmount;
    let totalContributions = startingAmount;
    let totalReturns = 0;
    let yearlyData: {
      period: number;
      startingBalance: number;
      contribution: number;
      investmentReturn: number;
      endingBalance: number;
      totalContributions: number;
      totalReturns: number;
      monthlyData: Array<{
        month: number;
        startingBalance: number;
        contribution: number;
        investmentReturn: number;
        endingBalance: number;
      }>;
    } | null = null;
    
    for (let month = 1; month <= monthsToSave; month++) {
      const startingBalance = balance;
      const contribution = high;
      const investmentReturn = calculateInvestmentReturnForMonth(balance, annualReturnRate);
      
      balance += contribution + investmentReturn;
      totalContributions += contribution;
      totalReturns += investmentReturn;
      
      // Start a new year's data
      if (month % 12 === 1 || month === 1) {
        const currentYear = Math.ceil(month / 12);
        yearlyData = {
          period: currentYear,
          startingBalance,
          contribution,
          investmentReturn,
          endingBalance: balance,
          totalContributions,
          totalReturns,
          monthlyData: [{
            month: (month - 1) % 12 + 1, // Convert to 1-12 month format
            startingBalance,
            contribution,
            investmentReturn,
            endingBalance: balance
          }]
        };
      } else if (yearlyData) {
        // Add monthly data to the current year
        yearlyData.monthlyData.push({
          month: (month - 1) % 12 + 1, // Convert to 1-12 month format
          startingBalance,
          contribution,
          investmentReturn,
          endingBalance: balance
        });
        
        // Update the year's ending values
        yearlyData.endingBalance = balance;
        yearlyData.totalContributions = totalContributions;
        yearlyData.totalReturns = totalReturns;
      }
      
      // Add data point for each year and the final month
      if (month % 12 === 0 || month === monthsToSave) {
        if (yearlyData) {
          growthData.push(yearlyData);
          yearlyData = null;
        }
      }
    }
    
    setInvestmentGrowthData(growthData);
    setMonthlySavingsNeeded(high);
    setShowResults(true);
  };
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Format month name
  const getMonthName = (monthNumber: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  };
  
  // Toggle year expansion
  const toggleYearExpansion = (year: number) => {
    if (expandedYear === year) {
      setExpandedYear(null);
    } else {
      setExpandedYear(year);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4 md:px-8 max-w-120rem mx-auto w-full">
        <InfoCard title="Down Payment Savings Calculator">
          <p>
            This calculator helps you determine how much you need to save each month to reach your down payment goal.
            It assumes you'll be investing your savings in the S&P 500 with an average annual return of 10%.
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1">
            <li>Enter your financial details and home price</li>
            <li>Specify your desired down payment percentage</li>
            <li>Set your timeline for saving</li>
            <li>Calculate how much you need to save monthly</li>
          </ul>
        </InfoCard>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="bg-muted">
              <CardTitle>Down Payment Calculator</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCalculate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="annualIncome"
                      type="number"
                      className="pl-7"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="homePrice">Home Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="homePrice"
                      type="number"
                      className="pl-7"
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="downPaymentPercent">Down Payment Percentage</Label>
                  <div className="relative">
                    <Input
                      id="downPaymentPercent"
                      type="number"
                      className="pr-7"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      min="1"
                      max="100"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Down payment amount: {formatCurrency(downPaymentAmount)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timelineYears">Timeline (Years)</Label>
                  <Input
                    id="timelineYears"
                    type="number"
                    value={timelineYears}
                    onChange={(e) => setTimelineYears(Number(e.target.value))}
                    min="1"
                    max="30"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentSavings">Current Savings</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="currentSavings"
                      type="number"
                      className="pl-7"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Calculate Monthly Savings</Button>
              </form>
            </CardContent>
          </Card>
          
          {showResults && (
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
                  
                  <div>
                    <h3 className="text-lg font-medium">Assumptions</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>S&P 500 average annual return: 10%</li>
                      <li>Monthly compounding of returns</li>
                      <li>Consistent monthly contributions</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                    <p className="text-xs text-yellow-700 mt-1">
                      This calculator provides an estimate based on historical average returns. 
                      Actual investment performance may vary. Past performance is not a guarantee of future results.
                    </p>
                  </div>
                  
                  {/* Investment Growth Table */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Down Payment Savings Growth</h3>
                    <Table>
                      <TableCaption>
                        Investment growth over {timelineYears} {timelineYears === 1 ? 'year' : 'years'} (Click on a year to see monthly breakdown)
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead></TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Starting Balance</TableHead>
                          <TableHead>Annual Contribution</TableHead>
                          <TableHead>Investment Returns</TableHead>
                          <TableHead>Ending Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {investmentGrowthData.map((data, index) => (
                          <React.Fragment key={index}>
                            <TableRow 
                              className={cn(
                                "cursor-pointer hover:bg-muted/80",
                                expandedYear === data.period ? "bg-muted/70" : ""
                              )}
                              onClick={() => toggleYearExpansion(data.period)}
                            >
                              <TableCell className="w-6">
                                {expandedYear === data.period ? 
                                  <ChevronDown className="h-4 w-4" /> : 
                                  <ChevronRight className="h-4 w-4" />
                                }
                              </TableCell>
                              <TableCell>{data.period}</TableCell>
                              <TableCell>{formatCurrency(data.startingBalance)}</TableCell>
                              <TableCell>{formatCurrency(data.contribution * 12)}</TableCell>
                              <TableCell className="text-green-600">
                                {formatCurrency(data.totalReturns - (index > 0 ? investmentGrowthData[index-1].totalReturns : 0))}
                              </TableCell>
                              <TableCell className="font-medium">{formatCurrency(data.endingBalance)}</TableCell>
                            </TableRow>
                            
                            {/* Monthly breakdown */}
                            {expandedYear === data.period && data.monthlyData && (
                              <TableRow>
                                <TableCell colSpan={6} className="p-0 border-0">
                                  <div className="bg-muted/30 px-4 py-2 rounded-md mx-2 my-1">
                                    <h4 className="text-sm font-medium mb-2">Monthly Breakdown - Year {data.period}</h4>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="text-xs">Month</TableHead>
                                          <TableHead className="text-xs">Starting Balance</TableHead>
                                          <TableHead className="text-xs">Contribution</TableHead>
                                          <TableHead className="text-xs">Investment Return</TableHead>
                                          <TableHead className="text-xs">Ending Balance</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {data.monthlyData.map((monthData, monthIndex) => (
                                          <TableRow key={monthIndex} className="text-xs">
                                            <TableCell>{getMonthName(monthData.month)}</TableCell>
                                            <TableCell>{formatCurrency(monthData.startingBalance)}</TableCell>
                                            <TableCell>{formatCurrency(monthData.contribution)}</TableCell>
                                            <TableCell className="text-green-600">
                                              {formatCurrency(monthData.investmentReturn)}
                                            </TableCell>
                                            <TableCell>{formatCurrency(monthData.endingBalance)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>Totals</TableCell>
                          <TableCell>{formatCurrency(investmentGrowthData.length > 0 ? investmentGrowthData[investmentGrowthData.length-1].totalContributions - currentSavings : 0)}</TableCell>
                          <TableCell className="text-green-600">{formatCurrency(investmentGrowthData.length > 0 ? investmentGrowthData[investmentGrowthData.length-1].totalReturns : 0)}</TableCell>
                          <TableCell>{formatCurrency(investmentGrowthData.length > 0 ? investmentGrowthData[investmentGrowthData.length-1].endingBalance : 0)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DownPaymentCalculator;
