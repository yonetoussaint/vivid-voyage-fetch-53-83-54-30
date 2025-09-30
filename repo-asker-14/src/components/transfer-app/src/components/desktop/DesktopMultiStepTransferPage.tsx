import React, { useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import DesktopHeader from './DesktopHeader';
import DesktopTransferProcess from './DesktopTransferProcess';
import DesktopSidebarSections from './DesktopSidebarSections';
import TransferHistoryService from '@/services/transferHistoryService';
import { usePersistedTransferState } from '@/hooks/usePersistedTransferState';
import { useState } from 'react';

export interface TransferData {
  transferType: 'national' | 'international';
  amount: string;
  transferDetails: {
    receivingCountry: string;
    deliveryMethod: string;
  };
  receiverDetails: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    department: string;
    commune: string;
    email?: string;
    moncashPhoneNumber?: string;
  };
  paymentMethod: 'creditCard' | 'paypal' | 'bankTransfer';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  paypalEmail: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  selectedPaymentMethod?: string;
}

const DesktopMultiStepTransferPage: React.FC = () => {
  const { toast } = useToast();

  // Use persisted state hook
  const {
    transferData: persistedData,
    currentStep,
    setCurrentStep,
    updateTransferData: updatePersistedData,
    resetTransferState
  } = usePersistedTransferState('international');

  // Merge persisted data with desktop-specific fields
  const [transferData, setTransferDataState] = useState<TransferData>({
    ...persistedData,
    transferType: (persistedData.transferType as 'national' | 'international') || 'international',
    paymentMethod: 'creditCard',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paypalEmail: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    sortCode: '',
  });

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isPaymentFormValid, setIsPaymentFormValid] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const userEmail = 'default@example.com';
  const receiptRef = useRef<HTMLDivElement>(null);

  // Listen for form validation changes
  useEffect(() => {
    const handleFormValidation = (event: any) => {
      setIsPaymentFormValid(event.detail.isValid);
    };

    window.addEventListener('paymentFormValidation', handleFormValidation);
    return () => window.removeEventListener('paymentFormValidation', handleFormValidation);
  }, []);

  // Listen for payment success
  useEffect(() => {
    const handlePaymentSuccess = (event: any) => {
      console.log('Payment success event received:', event.detail);
      const orderDetails = event.detail.orderDetails;

      const actualTransactionId = orderDetails?.id || `TX${Date.now()}`;
      setTransactionId(actualTransactionId);
      setCurrentStep(7);
      setIsPaymentLoading(false);

      // Save transfer to history
      TransferHistoryService.saveTransfer(transferData, actualTransactionId);

      toast({
        title: "Payment Successful!",
        description: "Your payment has been processed successfully.",
      });

      // Clear persisted state after successful payment
      setTimeout(() => {
        resetTransferState();
      }, 5000);
    };

    window.addEventListener('paymentSuccess', handlePaymentSuccess);
    return () => window.removeEventListener('paymentSuccess', handlePaymentSuccess);
  }, [toast, transferData, resetTransferState]);

  // Listen for payment errors to stop loading overlay
  useEffect(() => {
    const handlePaymentError = (event: any) => {
      console.log('Payment error detected:', event.detail.message);
      setIsPaymentLoading(false);
    };

    window.addEventListener('paymentError', handlePaymentError);
    return () => window.removeEventListener('paymentError', handlePaymentError);
  }, []);

  const updateTransferData = (data: Partial<TransferData>) => {
    setTransferDataState((prevData) => ({ ...prevData, ...data }));
    // Also update persisted data for the core transfer fields
    const persistedFields = {
      transferType: data.transferType,
      amount: data.amount,
      transferDetails: data.transferDetails,
      receiverDetails: data.receiverDetails,
      selectedPaymentMethod: data.selectedPaymentMethod
    };
    updatePersistedData(persistedFields);
  };

  const handleNextStep = () => {
    let nextStep = currentStep + 1;
    
    // Skip step 4 (location selection) if delivery method is MonCash or NatCash
    if (currentStep === 3 && (transferData.transferDetails.deliveryMethod === 'moncash' || transferData.transferDetails.deliveryMethod === 'natcash')) {
      nextStep = 5; // Skip step 4 and go directly to step 5
    }
    
    setCurrentStep(nextStep);
  };

  const handlePreviousStep = () => {
    let previousStep = currentStep - 1;
    
    // Skip step 4 (location selection) when going back if delivery method is MonCash or NatCash
    if (currentStep === 5 && (transferData.transferDetails.deliveryMethod === 'moncash' || transferData.transferDetails.deliveryMethod === 'natcash')) {
      previousStep = 3; // Skip step 4 and go directly to step 3
    }
    
    setCurrentStep(previousStep);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return transferData.amount !== '';
      case 2:
        return (
          transferData.transferDetails.receivingCountry !== '' &&
          transferData.transferDetails.deliveryMethod !== ''
        );
      case 3:
        const isDigitalWallet = transferData.transferDetails.deliveryMethod === 'moncash' || transferData.transferDetails.deliveryMethod === 'natcash';
        return (
          transferData.receiverDetails.firstName !== '' &&
          transferData.receiverDetails.lastName !== '' &&
          // For digital wallets, commune is not required; for cash pickup, it is
          (isDigitalWallet || transferData.receiverDetails.commune !== '') &&
          // Check for appropriate phone number based on delivery method
          (isDigitalWallet 
            ? transferData.receiverDetails.moncashPhoneNumber !== '' 
            : transferData.receiverDetails.phoneNumber !== '')
        );
      case 4:
        const isDigitalWalletStep4 = transferData.transferDetails.deliveryMethod === 'moncash' || transferData.transferDetails.deliveryMethod === 'natcash';
        // Step 4 is location for cash pickup, or review for digital wallets
        if (isDigitalWalletStep4) {
          return true; // Digital wallet review step can always proceed
        } else {
          return transferData.receiverDetails.commune !== ''; // Cash pickup requires location
        }
      case 5:
        const isDigitalWalletStep5 = transferData.transferDetails.deliveryMethod === 'moncash' || transferData.transferDetails.deliveryMethod === 'natcash';
        if (isDigitalWalletStep5) {
          return transferData.selectedPaymentMethod !== ''; // Digital wallet: payment method selection
        } else {
          return true; // Cash pickup: review step can always proceed
        }
      case 6:
        return transferData.transferType === 'national' ? true : isPaymentFormValid;
      default:
        return false;
    }
  };

  // MonCash payment handler for national transfers
  const handleMonCashPayment = async () => {
    if (!transferData.amount || !transferData.receiverDetails.firstName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please complete all required fields before proceeding.",
      });
      return;
    }

    setIsPaymentLoading(true);

    try {
      // First get the access token
      const tokenResponse = await fetch('https://moncash-backend.onrender.com/api/get-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error || 'Failed to get MonCash access token');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.accessToken;

      if (!accessToken) {
        throw new Error('Invalid access token received from MonCash');
      }

      // Create payment with access token
      const orderId = `TX${Date.now()}`;
      const paymentResponse = await fetch('https://moncash-backend.onrender.com/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          amount: transferData.amount,
          orderId
        })
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || 'Failed to create MonCash payment');
      }

      const paymentData = await paymentResponse.json();

      if (!paymentData.paymentUrl) {
        throw new Error('No payment URL received from MonCash');
      }

      // Redirect to MonCash payment page
      window.location.href = paymentData.paymentUrl;

    } catch (error) {
      console.error('MonCash payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Failed to process MonCash payment. Please try again.",
      });
      setIsPaymentLoading(false);
    }
  };

  const onPaymentSubmit = async () => {
    if (transferData.transferType === 'national') {
      await handleMonCashPayment();
    } else {
      setIsPaymentLoading(true);

      try {
        // Trigger the PayPal form submission
        const cardForm = document.querySelector("#card-form") as HTMLFormElement;
        if (cardForm) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          cardForm.dispatchEvent(submitEvent);
        }
      } catch (error) {
        console.error('Payment failed:', error);
        setIsPaymentLoading(false);
      }
    }
  };

  const generateReceiptImage = async () => {
    if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2,
          useCORS: true,
        });

        const dataURL = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'transfer_receipt.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Receipt Downloaded",
          description: "Your receipt has been downloaded as a PNG image.",
        });
      } catch (error) {
        console.error('Error generating image:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate receipt image.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DesktopHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Transfer Process */}
          <div className="order-2 md:order-1">
            <DesktopTransferProcess
              currentStep={currentStep}
              transferData={transferData}
              updateTransferData={updateTransferData}
              onPaymentSubmit={onPaymentSubmit}
              isPaymentLoading={isPaymentLoading}
              isPaymentFormValid={isPaymentFormValid}
              setIsPaymentFormValid={setIsPaymentFormValid}
              transactionId={transactionId}
              userEmail={userEmail}
              receiptRef={receiptRef}
              generateReceiptImage={generateReceiptImage}
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              canProceed={canProceed()}
            />
          </div>

          {/* Right Column - Sidebar Sections */}
          <div className="order-1 md:order-2">
            <DesktopSidebarSections />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopMultiStepTransferPage;
