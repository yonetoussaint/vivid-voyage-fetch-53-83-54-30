
import React from 'react';

interface MonCashPaymentInfoProps {
  receiverAmount: string;
  receiverName: string;
}

const MonCashPaymentInfo: React.FC<MonCashPaymentInfoProps> = ({
  receiverAmount,
  receiverName
}) => {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Recipient:</span>
          <span className="font-medium">{receiverName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium">HTG {receiverAmount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Transfer Type:</span>
          <span className="font-medium capitalize">National</span>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <h4 className="font-semibold text-red-800 mb-1 text-sm">MonCash Payment</h4>
        <p className="text-xs text-red-700 mb-2">
          You will be redirected to MonCash to complete your payment securely.
        </p>
        <ul className="text-xs text-red-600 space-y-0.5">
          <li>• Make sure you have your MonCash account ready</li>
          <li>• Have sufficient funds in your MonCash wallet</li>
          <li>• Complete the payment on MonCash website</li>
          <li>• You will be redirected back after payment</li>
        </ul>
      </div>
    </div>
  );
};

export default MonCashPaymentInfo;
