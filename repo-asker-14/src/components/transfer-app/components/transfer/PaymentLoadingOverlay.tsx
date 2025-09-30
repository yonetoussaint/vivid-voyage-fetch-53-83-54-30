
import React from 'react';
import { Key } from 'lucide-react';

interface PaymentLoadingOverlayProps {
  isVisible: boolean;
}

const PaymentLoadingOverlay: React.FC<PaymentLoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center">
      <div className="relative">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        {/* Key Icon in the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Key className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default PaymentLoadingOverlay;
