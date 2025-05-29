import React, { useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useStepByStepCalculator } from "@/hooks/useStepByStepCalculator";
import GeneralInputsStep from "@/components/step-by-step/GeneralInputsStep";
import BuyingInputsStep from "@/components/step-by-step/BuyingInputsStep";
import RentingInputsStep from "@/components/step-by-step/RentingInputsStep";
import InvestmentInputsStep from "@/components/step-by-step/InvestmentInputsStep";
import ResultsStep from "@/components/step-by-step/ResultsStep";

const StepByStepCalculator = () => {
  const {
    formData,
    currentStep,
    results,
    validationError,
    handleGeneralChange,
    handleBuyingChange,
    handleRentingChange,
    handleInvestmentChange,
    handleReset,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    canProceedToNextStep
  } = useStepByStepCalculator();
  
  // Memoize the canProceed value to prevent infinite renders
  const canProceed = useMemo(() => canProceedToNextStep(), [
    formData.general.currentSavings,
    formData.buying.housePrice,
    formData.general.downPaymentPercent,
    validationError
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-100">
      <Header />
      
      <main className="flex-grow py-8 px-4 md:px-8 max-w-120rem mx-auto w-full">
        {currentStep === 'general' && (
          <GeneralInputsStep
            values={formData.general}
            onChange={handleGeneralChange}
            formData={formData}
            validationError={validationError}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            canProceed={canProceed}
            currentStep={currentStep}
          />
        )}
        
        {currentStep === 'buying' && (
          <BuyingInputsStep
            values={formData.buying}
            onChange={handleBuyingChange}
            formData={formData}
            validationError={validationError}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            canProceed={canProceed}
            currentStep={currentStep}
          />
        )}
        
        {currentStep === 'renting' && (
          <RentingInputsStep
            values={formData.renting}
            onChange={handleRentingChange}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            canProceed={true}
            currentStep={currentStep}
          />
        )}
        
        {currentStep === 'investment' && (
          <InvestmentInputsStep
            values={formData.investment}
            onChange={handleInvestmentChange}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            canProceed={true}
            currentStep={currentStep}
          />
        )}
        
        {currentStep === 'results' && results && (
          <ResultsStep
            results={results}
            onReset={handleReset}
            onPrevious={goToPreviousStep}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default StepByStepCalculator;
