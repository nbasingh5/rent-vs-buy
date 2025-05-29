import { ComparisonResults } from "@/lib/types";
import { TableColumn, ComparisonTableData, YearlyTableData } from "@/lib/types/tableTypes";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState, useEffect, ReactNode } from "react";
import ComparisonTableTab from "./ComparisonTableTab";
import { ColumnSelector } from "../ui/column-selector";
import { useIsMobile } from "@/hooks/use-mobile";

interface ComparisonTableProps {
  results: ComparisonResults | null;
}

const ComparisonTable = ({ results }: ComparisonTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [summaryColumnsState, setSummaryColumnsState] = useState<TableColumn<ComparisonTableData>[]>([]);
  const [buyingColumnsState, setBuyingColumnsState] = useState<TableColumn<YearlyTableData>[]>([]);
  const [rentingColumnsState, setRentingColumnsState] = useState<TableColumn<YearlyTableData>[]>([]);
  const [activeTab, setActiveTab] = useState("summary");
  const isMobile = useIsMobile();

  if (!results) return null;

  // Defensive check for data integrity
  if (!results.yearlyComparisons || !results.buyingResults || !results.rentingResults) {
    console.error("Missing required data in comparison results:", results);
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Year-by-Year Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Error loading comparison data. Please try recalculating.</p>
        </CardContent>
      </Card>
    );
  }

  const { yearlyComparisons, buyingResults, rentingResults } = results; 

  const toggleRow = (tabKey: string, rowId: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [`${tabKey}-${rowId}`]: !prev[`${tabKey}-${rowId}`]
    }));
  };

  // Define default columns with visibility and importance settings
  const defaultSummaryColumns: TableColumn<ComparisonTableData>[] = [
    { key: "year", label: "Year", isVisible: true, isImportant: true },
    { key: "cumulativeBuyingCosts", label: "Buying Costs", isVisible: !isMobile, isImportant: false },
    { key: "cumulativeRentingCosts", label: "Renting Costs", isVisible: !isMobile, isImportant: false },
    { key: "buyingLeftoverInvestmentValue", label: "Buying Investments", isVisible: !isMobile, isImportant: false },
    { key: "rentingLeftoverInvestmentValue", label: "Renting Investments", isVisible: !isMobile, isImportant: false },
    { key: "buyingWealth", label: "Buying Wealth", isVisible: true, isImportant: true },
    { key: "rentingWealth", label: "Renting Wealth", isVisible: true, isImportant: true },
    { key: "difference", label: "Difference", isVisible: true, isImportant: true },
    { key: "betterOption", label: "Better Option", isVisible: true, isImportant: true }
  ];

  const defaultBuyingColumns: TableColumn<YearlyTableData>[] = [
    { key: "year", label: "Year", isVisible: true, isImportant: true },
    { key: "yearlyIncome", label: "Annual Income", isVisible: true, isImportant: true },
    { key: "mortgagePayment", label: "Mortgage Payment", isVisible: true, isImportant: true },
    { key: "principalPaid", label: "Principal Paid", isVisible: !isMobile, isImportant: false },
    { key: "interestPaid", label: "Interest Paid", isVisible: !isMobile, isImportant: false },
    { key: "propertyTaxes", label: "Property Taxes", isVisible: false, isImportant: false },
    { key: "homeInsurance", label: "Insurance", isVisible: false, isImportant: false },
    { key: "maintenanceCosts", label: "Maintenance", isVisible: false, isImportant: false },
    { key: "monthlyExpenses", label: "Monthly Expenses", isVisible: true, isImportant: false },
    { key: "yearlySavings", label: "Yearly Savings", isVisible: true, isImportant: false },
    { key: "amountInvested", label: "Amount Invested", isVisible: !isMobile, isImportant: false },
    { key: "investmentEarnings", label: "Investment Earnings", isVisible: !isMobile, isImportant: false },
    { key: "investmentsWithEarnings", label: "Investments with Earnings", isVisible: !isMobile, isImportant: false },
    { key: "loanBalance", label: "Loan Balance", isVisible: !isMobile, isImportant: false },
    { key: "homeValue", label: "Home Value", isVisible: true, isImportant: true },
    { key: "homeEquity", label: "Home Equity", isVisible: true, isImportant: true },
    { key: "capitalGainsTaxPaid", label: "Capital Gains Tax", isVisible: !isMobile, isImportant: false },
    { key: "totalWealthBuying", label: "Total Wealth", isVisible: true, isImportant: true }
  ];

  const defaultRentingColumns: TableColumn<YearlyTableData>[] = [
    { key: "year", label: "Year", isVisible: true, isImportant: true },
    { key: "yearlyIncome", label: "Annual Income", isVisible: true, isImportant: true },
    { key: "totalRent", label: "Total Rent", isVisible: true, isImportant: true },
    { key: "monthlyExpenses", label: "Monthly Expenses", isVisible: true, isImportant: false },
    { key: "yearlySavings", label: "Yearly Savings", isVisible: true, isImportant: false },
    { key: "amountInvested", label: "Amount Invested", isVisible: !isMobile, isImportant: false },
    { key: "investmentEarnings", label: "Investment Earnings", isVisible: !isMobile, isImportant: false },
    { key: "investmentValueBeforeTax", label: "Investment Value (Before Tax)", isVisible: false, isImportant: false },
    { key: "capitalGainsTaxPaid", label: "Capital Gains Tax", isVisible: false, isImportant: false },
    { key: "totalWealthRenting", label: "Total Wealth", isVisible: true, isImportant: true }
  ];

  // Initialize column states
  useEffect(() => {
    setSummaryColumnsState(defaultSummaryColumns);
    setBuyingColumnsState(defaultBuyingColumns);
    setRentingColumnsState(defaultRentingColumns);
  }, [isMobile]);

  //  Enhance yearly comparisons with better option
  const enhancedYearlyComparisons = yearlyComparisons.map(year => {
    let betterOption: ReactNode;

    if (year.difference > 0) {
      betterOption = (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-buy/10 text-buy-dark">
          Buying
        </span>
      );
    } else if (year.difference < 0) {
      betterOption = (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-rent/10 text-rent-dark">
          Renting
        </span>
      );
    } else {
      betterOption = (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          Equal
        </span>
      );
    }

    return {
      ...year,
      betterOption
    };
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base sm:text-xl">Year-by-Year Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="summary" 
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 mb-6 h-10 sm:h-12">
            <TabsTrigger 
              value="summary" 
              className="text-xs sm:text-sm py-1 sm:py-2"
            >
              Summary
            </TabsTrigger>
            <TabsTrigger 
              value="buying" 
              className="text-xs sm:text-sm py-1 sm:py-2"
            >
              Buying Details
            </TabsTrigger>
            <TabsTrigger 
              value="renting" 
              className="text-xs sm:text-sm py-1 sm:py-2"
            >
              Renting Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs sm:text-sm font-medium">Summary View</h3>
              <ColumnSelector 
                columns={summaryColumnsState} 
                onChange={setSummaryColumnsState} 
              />
            </div>
            <div className="overflow-x-auto">
              <ComparisonTableTab
                data={enhancedYearlyComparisons}
                columns={summaryColumnsState.filter(col => col.isVisible !== false)}
                tabId="summary"
                expandedRows={expandedRows}
                onToggleRow={toggleRow}
                className="min-w-[600px] sm:min-w-full"
              />
            </div>
          </TabsContent>

          <TabsContent value="buying">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs sm:text-sm font-medium">Buying Details</h3>
              <ColumnSelector 
                columns={buyingColumnsState} 
                onChange={setBuyingColumnsState} 
              />
            </div>
            <div className="overflow-x-auto">
              <ComparisonTableTab
                data={buyingResults}
                columns={buyingColumnsState.filter(col => col.isVisible !== false)}
                tabId="buying"
                expandedRows={expandedRows}
                onToggleRow={toggleRow}
                className="min-w-[600px] sm:min-w-full"
              />
            </div>
          </TabsContent>

          <TabsContent value="renting">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs sm:text-sm font-medium">Renting Details</h3>
              <ColumnSelector 
                columns={rentingColumnsState} 
                onChange={setRentingColumnsState} 
              />
            </div>
            <div className="overflow-x-auto">
              <ComparisonTableTab
                data={rentingResults}
                columns={rentingColumnsState.filter(col => col.isVisible !== false)}
                tabId="renting"
                expandedRows={expandedRows}
                onToggleRow={toggleRow}
                className="min-w-[600px] sm:min-w-full"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComparisonTable;
