import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: {
    number: number;
    label: string;
  }[];
  showStepText?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  steps,
  showStepText = true,
  className = ''
}) => {
  return (
    <div className={`bg-white border-b border-gray-200 px-4 py-6 ${className}`}>
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="relative mb-4">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center flex-1">
                {/* Connection Line */}
                {index > 0 && (
                  <div 
                    className={`absolute top-4 h-0.5 -translate-y-1/2 ${
                      currentStep >= step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    style={{
                      left: `${(index - 1) * (100 / (totalSteps - 1))}%`,
                      width: `${100 / (totalSteps - 1)}%`
                    }}
                  />
                )}
                
                {/* Step Circle */}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
                </div>
                
                {/* Step Label */}
                <span className={`text-xs mt-2 text-center ${
                  currentStep >= step.number ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Progress Text */}
        {showStepText && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;