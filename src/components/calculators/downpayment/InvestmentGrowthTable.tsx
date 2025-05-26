import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MonthlyData {
  month: number;
  startingBalance: number;
  contribution: number;
  investmentReturn: number;
  endingBalance: number;
}

interface YearlyData {
  period: number;
  startingBalance: number;
  contribution: number;
  investmentReturn: number;
  endingBalance: number;
  totalContributions: number;
  totalReturns: number;
  capitalGains: number;
  monthlyData: MonthlyData[];
}

interface InvestmentGrowthTableProps {
  investmentGrowthData: YearlyData[];
  timelineYears: number;
}

const InvestmentGrowthTable: React.FC<InvestmentGrowthTableProps> = ({
  investmentGrowthData,
  timelineYears,
}) => {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

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
            <TableHead>Capital Gains Tax</TableHead>
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
                  {formatCurrency(data.totalReturns - (index > 0 ? investmentGrowthData[index - 1].totalReturns : 0))}
                </TableCell>
                <TableCell>{formatCurrency(data.capitalGains)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(data.endingBalance)}</TableCell>
              </TableRow>

              {/* Monthly breakdown */}
              {expandedYear === data.period && data.monthlyData && (
                <TableRow>
                  <TableCell colSpan={7} className="p-0 border-0">
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
            <TableCell>-</TableCell>
            <TableCell>{formatCurrency(investmentGrowthData.length > 0 ? investmentGrowthData[investmentGrowthData.length - 1].totalContributions : 0)}</TableCell>
            <TableCell>{formatCurrency(investmentGrowthData.length > 0 ? investmentGrowthData[investmentGrowthData.length - 1].totalReturns : 0)}</TableCell>
            <TableCell>{formatCurrency(investmentGrowthData.length > 0 ? investmentGrowthData[investmentGrowthData.length - 1].capitalGains : 0)}</TableCell>
            <TableCell>{formatCurrency(investmentGrowthData.length > 0 ? investmentGrowthData[investmentGrowthData.length - 1].endingBalance : 0)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default InvestmentGrowthTable;
