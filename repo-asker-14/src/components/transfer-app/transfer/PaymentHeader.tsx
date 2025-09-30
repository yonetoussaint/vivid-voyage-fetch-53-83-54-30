
import React from 'react';

interface PaymentHeaderProps {
  transferType: 'national' | 'international';
  amount: string;
  receiverAmount: string;
  receiverName: string;
}

const PaymentHeader: React.FC<PaymentHeaderProps> = ({
  transferType,
  amount,
  receiverAmount,
  receiverName
}) => {
  return (
    <div className="text-center mb-4">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        Sending <span className="font-semibold text-blue-600">
          {transferType === 'national'
            ? `HTG ${receiverAmount}`
            : `$${amount}`
          }
        </span> to{' '}
        <span className="font-semibold text-gray-900">
          {receiverName}
        </span>
      </p>
    </div>
  );
};

export default PaymentHeader;
