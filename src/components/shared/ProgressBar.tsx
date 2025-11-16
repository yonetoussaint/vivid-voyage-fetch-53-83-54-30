import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  activeColor?: string;
  inactiveColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  className = '',
  activeColor = 'bg-blue-600',
  inactiveColor = 'bg-gray-300'
}) => {
  return (
    <div className={`px-4 py-4 ${className}`}>
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber <= currentStep;
            
            return (
              <div
                key={stepNumber}
                className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                  isActive ? activeColor : inactiveColor
                }`}
              />
            );
          })}
        </div>
        
        {/* Progress Text */}
        <div className="text-center mt-2">
          <p className="text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;