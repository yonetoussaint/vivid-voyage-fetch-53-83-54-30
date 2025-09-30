import { useState, useEffect } from 'react';
import { TransferData } from '@/pages/MobileMultiStepTransferSheetPage';

const TRANSFER_STATE_KEY = 'global_transfer_state';
const TRANSFER_STEP_KEY = 'global_transfer_step';

export const usePersistedTransferState = (defaultTransferType: 'international' | 'national' = 'international') => {
  // Initialize from localStorage or defaults
  const getInitialTransferData = (): TransferData => {
    try {
      const saved = localStorage.getItem(TRANSFER_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          transferType: parsed.transferType || defaultTransferType
        };
      }
    } catch (error) {
      console.error('Error loading transfer state:', error);
    }
    
    return {
      transferType: defaultTransferType,
      amount: '100.00',
      transferDetails: {
        receivingCountry: '',
        deliveryMethod: ''
      },
      receiverDetails: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        department: 'Artibonite',
        commune: '',
        email: '',
        moncashPhoneNumber: '',
      },
      selectedPaymentMethod: 'credit-card'
    };
  };

  const getInitialStep = (): number => {
    try {
      const saved = localStorage.getItem(TRANSFER_STEP_KEY);
      if (saved) {
        const step = parseInt(saved, 10);
        return step >= 1 && step <= 7 ? step : 1;
      }
    } catch (error) {
      console.error('Error loading transfer step:', error);
    }
    return 1;
  };

  const [transferData, setTransferData] = useState<TransferData>(getInitialTransferData);
  const [currentStep, setCurrentStep] = useState<number>(getInitialStep);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(TRANSFER_STATE_KEY, JSON.stringify(transferData));
    } catch (error) {
      console.error('Error saving transfer state:', error);
    }
  }, [transferData]);

  useEffect(() => {
    try {
      localStorage.setItem(TRANSFER_STEP_KEY, currentStep.toString());
    } catch (error) {
      console.error('Error saving transfer step:', error);
    }
  }, [currentStep]);

  const updateTransferData = (data: Partial<TransferData>) => {
    setTransferData(prev => ({ ...prev, ...data }));
  };

  const resetTransferState = () => {
    const initialData = {
      transferType: defaultTransferType,
      amount: '100.00',
      transferDetails: {
        receivingCountry: '',
        deliveryMethod: ''
      },
      receiverDetails: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        department: 'Artibonite',
        commune: '',
        email: '',
        moncashPhoneNumber: '',
      },
      selectedPaymentMethod: 'credit-card'
    };
    
    setTransferData(initialData);
    setCurrentStep(1);
    
    try {
      localStorage.removeItem(TRANSFER_STATE_KEY);
      localStorage.removeItem(TRANSFER_STEP_KEY);
    } catch (error) {
      console.error('Error clearing transfer state:', error);
    }
  };

  return {
    transferData,
    currentStep,
    setCurrentStep,
    updateTransferData,
    resetTransferState
  };
};
