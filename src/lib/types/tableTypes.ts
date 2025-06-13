// Table-specific type definitions

// Generic column definition type
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  isVisible?: boolean;
  isImportant?: boolean; // Important columns are visible by default and can't be hidden
}

// Monthly data types for tables
export interface MonthlyTableData {
  month: number;
  mortgagePayment?: number;
  principalPaid?: number;
  interestPaid?: number;
  propertyTaxes?: number;
  homeInsurance?: number;
  maintenanceCosts?: number;
  monthlyExpenses?: number;
  totalRent?: number;
  homeValue?: number;
  homeEquity?: number;
  loanBalance?: number;
  investmentsWithEarnings?: number;
  amountInvested: number;
  investmentEarnings: number;
  investmentValueBeforeTax?: number;
  capitalGainsTaxPaid?: number;
  totalWealthBuying: number;
  totalWealthRenting: number;
}

// Yearly data types for tables
export interface YearlyTableData {
  year: number;
  mortgagePayment?: number;
  principalPaid?: number;
  interestPaid?: number;
  propertyTaxes?: number;
  homeInsurance?: number;
  maintenanceCosts?: number;
  monthlyExpenses?: number;
  totalRent?: number;
  amountInvested: number;
  investmentEarnings: number;
  investmentsWithEarnings?: number;
  loanBalance?: number;
  homeValue?: number;
  homeEquity?: number;
  totalWealthBuying: number;
  totalWealthRenting: number;
  investmentValueBeforeTax?: number;
  capitalGainsTaxPaid?: number;
  monthlyData?: any[]; // Will be typed more specifically in components
}

// Comparison data for tables
export interface ComparisonTableData extends YearlyTableData {
  buyingWealth: number;
  rentingWealth: number;
  difference: number;
  cumulativeBuyingCosts: number;
  cumulativeRentingCosts: number;
  betterOption?: React.ReactNode;
}

// Props for table components
export interface MonthlyBreakdownTableProps {
  year: number;
  columns: TableColumn<MonthlyTableData>[];
  rowData: YearlyTableData;
}

export interface ComparisonTableTabProps {
  data: YearlyTableData[] | ComparisonTableData[];
  columns: TableColumn<YearlyTableData | ComparisonTableData>[];
  tabId: string;
  expandedRows: Record<string, boolean>;
  onToggleRow: (tabId: string, rowId: number) => void;
}

export interface ExpandableRowProps {
  rowData: any;
  isExpanded: boolean;
  onToggle: () => void;
  columns: TableColumn<any>[];
}