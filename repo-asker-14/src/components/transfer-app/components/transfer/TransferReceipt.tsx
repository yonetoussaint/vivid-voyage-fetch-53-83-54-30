import React, { forwardRef } from 'react';
import { CheckCircle, Receipt } from 'lucide-react';
import { TransferData } from '@/pages/MobileMultiStepTransferSheetPage';

interface TransferReceiptProps {
  transferData: TransferData;
  transactionId: string;
  userEmail: string;
}

const TransferReceipt = forwardRef<HTMLDivElement, TransferReceiptProps>(
  ({ transferData, transactionId, userEmail }, ref) => {
    const transferFee = transferData.amount ? (Math.ceil(parseFloat(transferData.amount) / 100) * 15).toFixed(2) : '0.00';
    const totalAmount = transferData.amount ? (parseFloat(transferData.amount) + parseFloat(transferFee)).toFixed(2) : '0.00';

    return (
      <div
        ref={ref}
        className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4"
      >
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Receipt
          </h3>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Transaction ID</span>
            <span className="font-mono text-gray-900">{transactionId}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Status</span>
            <span className="text-green-600 font-medium">Completed</span>
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Recipient</span>
              <span className="font-medium">{transferData.receiverDetails.firstName} {transferData.receiverDetails.lastName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phone Number</span>
              <span className="font-medium">+509 {transferData.receiverDetails.phoneNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Location</span>
              <span className="font-medium text-right max-w-xs">{transferData.receiverDetails.commune}, {transferData.receiverDetails.department}</span>
            </div>
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount Sent</span>
              <span className="font-medium">${transferData.amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transfer Fee</span>
              <span className="font-medium">${transferFee}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-2">
              <span>Total Paid</span>
              <span className="text-blue-600">${totalAmount}</span>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium capitalize">
                {transferData.selectedPaymentMethod?.replace('-', ' ')}
              </span>
            </div>
          </div>

          {userEmail && (
            <div className="border-t pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Confirmation Email</span>
                <span className="font-medium">{userEmail}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-green-50 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Delivery Information</h4>
              <p className="text-sm text-green-700 mt-1">
                The recipient will receive the funds within 24-48 hours. They will be notified via SMS when the money is ready for pickup.
              </p>
              {userEmail && (
                <p className="text-sm text-green-700 mt-1">
                  A confirmation email has been sent to {userEmail}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TransferReceipt.displayName = 'TransferReceipt';

export default TransferReceipt;