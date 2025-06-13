import React from "react";
import { Separator } from "@/components/ui/separator";
import { ComparisonResults, FormData } from "@/lib/types";
import ResultsSummary from "@/components/results/ResultsSummary";
import ComparisonChart from "@/components/results/ComparisonChart";
import CostsChart from "@/components/results/CostsChart";
import ComparisonTable from "@/components/results/ComparisonTable";

interface ResultsContainerProps {
  results: ComparisonResults | null;
  formData: FormData;
}

const ResultsContainer: React.FC<ResultsContainerProps> = ({ results, formData }) => {
  if (!results) return null;

  return (
    <div id="results" className="mt-12">
      <Separator className="my-8" />
      <h2 className="text-2xl font-bold mb-6">Results</h2>
      
      <ResultsSummary results={results} />
      
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <ComparisonChart results={results} />
        <CostsChart results={results} />
      </div>
      
      <ComparisonTable results={results} formData={formData} />
    </div>
  );
};

export default ResultsContainer;