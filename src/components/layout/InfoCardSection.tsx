
import React from "react";
import InfoCard from "@/components/layout/InfoCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const InfoCardSection: React.FC = () => {
  return (
    <InfoCard title="About This Tool">
      <p>
        This tool helps you compare the financial outcomes of renting versus buying a home over your specified time period.
        By considering factors like property appreciation, investment returns, and various costs, you can make a more informed
        decision about whether renting or buying makes more financial sense for your situation.
      </p>
      <ul className="list-disc pl-5 mt-3 space-y-1">
        <li>Enter your financial details</li>
        <li>Customize assumptions for both scenarios</li>
        <li>Get a detailed year-by-year breakdown</li>
        <li>See visualizations of wealth growth</li>
      </ul>
      
      <div className="mt-4 p-3 bg-primary/10 rounded-md">
        <p className="text-sm font-medium">
          Prefer a guided experience? Try our step-by-step calculator:
        </p>
        <Link 
          to="/step-by-step" 
          className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
        >
          Step-by-Step Calculator
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </InfoCard>
  );
};

export default InfoCardSection;
