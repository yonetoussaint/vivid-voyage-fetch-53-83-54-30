import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MobileUserDropdown from '@/components/mobile/MobileUserDropdown';
import NativeProgressIndicator from './NativeProgressIndicator';

interface StepIndicatorProps {
  currentStep: number;
  onBack?: () => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onBack }) => {
  const navigate = useNavigate();
  const totalSteps = 8;
  
  const stepTitles = [
    'Amount', 
    'Delivery Method', 
    'Recipient Info',
    'Delivery Address', 
    'Review Transfer', 
    'Payment Method',
    'Complete Payment',
    'Transfer Complete'
  ];

  return (
    <motion.div 
      className="bg-white"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="px-4 py-1">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-10 flex justify-start">
              {currentStep > 1 && onBack && (
                <motion.button 
                  onClick={onBack}
                  className="flex items-center justify-center w-10 h-10 bg-transparent text-gray-600 rounded-full"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.05)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            <motion.div 
              className="flex-1 text-center"
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-xl font-semibold text-gray-900">
                {stepTitles[currentStep - 1]}
              </h1>
            </motion.div>

            {/* Profile dropdown on the right */}
            <div className="w-10 flex justify-end">
              <MobileUserDropdown />
            </div>
          </div>
          
          {/* Native Progress Indicator */}
          <NativeProgressIndicator 
            currentStep={currentStep} 
            totalSteps={totalSteps}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StepIndicator;