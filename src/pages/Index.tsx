
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InfoCardSection from "@/components/layout/InfoCardSection";
import FormContainer from "@/components/layout/FormContainer";
import ResultsContainer from "@/components/results/ResultsContainer";
import { useRentBuyCalculator } from "@/hooks/useRentBuyCalculator";

const Index = () => {
  const {
    formData,
    results,
    validationError,
    handleGeneralChange,
    handleBuyingChange,
    handleRentingChange,
    handleInvestmentChange,
    handleReset,
    handleCalculate
  } = useRentBuyCalculator();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="flex-grow py-8 px-4 md:px-8 max-w-120rem mx-auto w-full">
        <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
          <InfoCardSection />
        </div>
        
        <div className="mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
          <FormContainer 
            formData={formData}
            validationError={validationError}
            onGeneralChange={handleGeneralChange}
            onBuyingChange={handleBuyingChange}
            onRentingChange={handleRentingChange}
            onInvestmentChange={handleInvestmentChange}
            onCalculate={handleCalculate}
            onReset={handleReset}
          />
        </div>
        
        {results && (
          <div className="p-6 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
            <ResultsContainer results={results} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
