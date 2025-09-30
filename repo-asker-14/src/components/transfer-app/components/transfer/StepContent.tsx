
import React, { useEffect } from 'react';
import { TransferData } from '@/pages/MobileMultiStepTransferSheetPage';
import StepOneTransfer from './StepOneTransfer';
import StepOneLocalTransfer from './StepOneLocalTransfer';
import StepOnePointFiveTransfer from './StepOnePointFiveTransfer';
import StepTwoTransfer from './StepTwoTransfer';
import StepTwoPointFiveTransfer from './StepTwoPointFiveTransfer';
import TransferSummary from './TransferSummary';
import PaymentMethodSelection from './PaymentMethodSelection';
import PaymentMethodSelector from './PaymentMethodSelector';
import TransferReceipt from './TransferReceipt';
import NativeButton from './NativeButton';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImpactStyle } from '@capacitor/haptics';

interface StepContentProps {
  currentStep: number;
  transferData: TransferData;
  updateTransferData: (data: Partial<TransferData>) => void;
  onPaymentSubmit: () => void;
  isPaymentLoading: boolean;
  isPaymentFormValid: boolean;
  transactionId: string;
  userEmail: string;
  receiptRef: React.RefObject<HTMLDivElement>;
  generateReceiptImage: () => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  canProceed: boolean;
}

const StepContent: React.FC<StepContentProps> = ({
  currentStep,
  transferData,
  updateTransferData,
  onPaymentSubmit,
  isPaymentLoading,
  isPaymentFormValid,
  transactionId,
  userEmail,
  receiptRef,
  generateReceiptImage,
  onNextStep,
  onPreviousStep,
  canProceed
}) => {
  const navigate = useNavigate();

  // Debug logging for step 4
  useEffect(() => {
    if (currentStep === 4) {
      console.log('Step 4 - Transfer Summary rendering');
      console.log('Transfer data for summary:', transferData);
    }
  }, [currentStep, transferData]);

  // Helper function to get button text based on step
  const getButtonText = () => {
    if (currentStep === 7) {
      if (isPaymentLoading) {
        return transferData.transferType === 'national' ? 'Processing MonCash Payment...' : 'Processing...';
      }
      return transferData.transferType === 'national' 
        ? `Pay HTG ${(parseFloat(transferData.amount) * 127.5).toFixed(2)} with MonCash`
        : `Pay $${(parseFloat(transferData.amount) + Math.ceil(parseFloat(transferData.amount) / 100) * 15).toFixed(2)}`;
    }
    if (currentStep === 1) return 'Continue';
    if (currentStep === 8) return 'Done';
    return 'Next';
  };

  // Helper function to get button color based on step
  const getButtonColor = () => {
    return 'bg-slate-500 hover:bg-slate-600';
  };

  // Helper function to render sticky continue buttons for steps 1-7
  const renderContinueButtons = () => {
    if (currentStep >= 8) return null; // No buttons for final step

    return (
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white px-4 py-3"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="space-y-3 max-w-md mx-auto">
          {/* Continue/Pay Button */}
          <NativeButton 
            onClick={currentStep === 7 ? onPaymentSubmit : onNextStep}
            disabled={
              !canProceed || 
              isPaymentLoading || 
              (currentStep === 7 && transferData.transferType === 'international' && !isPaymentFormValid)
            }
            className={`h-14 rounded-2xl font-semibold text-white transition-all duration-300 ${getButtonColor()}`}
            hapticStyle={currentStep === 7 ? ImpactStyle.Heavy : ImpactStyle.Medium}
          >
            {getButtonText()}
          </NativeButton>
          
          {/* Notice for international and national transfers */}
          {currentStep === 1 && (
            <motion.div 
              className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.svg 
                className="w-4 h-4 text-primary" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </motion.svg>
              <span>
                {transferData.transferType === 'international' 
                  ? 'Send money internationally to Haiti from anywhere'
                  : 'Send money locally within Haiti'
                }
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="px-4 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-2xl font-medium text-foreground mb-1">
                How much are you sending?
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter the amount you want to send
              </p>
            </div>

            {transferData.transferType === 'national' ? (
              <StepOneLocalTransfer
                amount={transferData.amount}
                onAmountChange={(amount) => updateTransferData({ amount })}
              />
            ) : (
              <StepOneTransfer
                amount={transferData.amount}
                onAmountChange={(amount) => updateTransferData({ amount })}
              />
            )}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-foreground mb-1">
              How should they receive it?
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose your preferred delivery method
            </p>
          </div>
          
          <StepOnePointFiveTransfer
            transferDetails={transferData.transferDetails}
            onTransferDetailsChange={(transferDetails) => updateTransferData({ transferDetails })}
          />
        </div>
      )}

      {currentStep === 3 && (
        <StepTwoTransfer
          receiverDetails={transferData.receiverDetails}
          onDetailsChange={(receiverDetails) => updateTransferData({ receiverDetails })}
          transferDetails={transferData.transferDetails}
        />
      )}

      {currentStep === 4 && (
        <StepTwoPointFiveTransfer
          receiverDetails={transferData.receiverDetails}
          onDetailsChange={(receiverDetails) => updateTransferData({ receiverDetails })}
        />
      )}

      {currentStep === 5 && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
              Does everything look right?
            </h1>
            <p className="text-sm text-gray-600">Review your transfer details before proceeding</p>
          </div>

          <TransferSummary
            transferData={{
              ...transferData,
              transferType: transferData.transferType || 'international'
            }}
          />
          
          {/* Debug info for step 4 */}
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <p>Debug: Step 4 rendered successfully</p>
            <p>Amount: {transferData.amount}</p>
            <p>Recipient: {transferData.receiverDetails.firstName} {transferData.receiverDetails.lastName}</p>
            <p>Transfer Type: {transferData.transferType || 'international'}</p>
          </div>
        </div>
      )}

      {currentStep === 6 && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
              How would you like to pay?
            </h1>
            <p className="text-sm text-gray-600">
              Choose your preferred payment method
            </p>
          </div>
          
          <PaymentMethodSelection
            selectedMethod={transferData.selectedPaymentMethod || 'credit-card'}
            onMethodSelect={(method) => updateTransferData({ selectedPaymentMethod: method })}
            transferType={transferData.transferType}
          />
        </div>
      )}

      {currentStep === 7 && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-foreground mb-1">
              Complete your payment
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your payment details to complete the transfer
            </p>
          </div>
          
          <PaymentMethodSelector
            transferData={transferData}
            onPaymentSubmit={onPaymentSubmit}
            isPaymentLoading={isPaymentLoading}
            isPaymentFormValid={isPaymentFormValid}
          />
        </div>
      )}

      {currentStep === 8 && (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <TransferReceipt
            ref={receiptRef}
            transferData={transferData}
            transactionId={transactionId}
            userEmail={userEmail}
          />

          <div className="flex gap-3">
            <NativeButton
              variant="outline"
              onClick={generateReceiptImage}
              className="flex-1 h-12 rounded-xl"
              hapticStyle={ImpactStyle.Light}
            >
              Share Receipt
            </NativeButton>
            <NativeButton
              onClick={() => navigate('/for-you')}
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-hover"
              hapticStyle={ImpactStyle.Medium}
            >
              Done
            </NativeButton>
          </div>
        </motion.div>
      )}

      {/* Continue Buttons for all steps except final receipt step */}
      {renderContinueButtons()}
    </motion.div>
  );
};

export default StepContent;
