import React from 'react';
import { motion } from 'framer-motion';

interface NativeProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const NativeProgressIndicator: React.FC<NativeProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  className = ''
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={`relative ${className}`}>
      {/* Background track */}
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        {/* Animated progress bar */}
        <motion.div
          className="h-full bg-ali-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
            mass: 1,
          }}
        />
      </div>
    </div>
  );
};

export default NativeProgressIndicator;