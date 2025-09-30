
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, DollarSign, MapPin, CreditCard, Building } from 'lucide-react';

interface TransferData {
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
  };
  selectedPaymentMethod?: string;
}

interface TransferSummaryProps {
  transferData: TransferData;
}

const TransferSummary: React.FC<TransferSummaryProps> = ({ transferData }) => {
  const exchangeRate = transferData.transferType === 'international' ? 110 : 1;
  const transferFee = parseFloat(transferData.amount) * 0.02; // 2% fee
  const totalAmount = parseFloat(transferData.amount) + transferFee;
  const receivingAmount = parseFloat(transferData.amount) * exchangeRate;

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'haiti': '🇭🇹',
      'dominican-republic': '🇩🇴',
      'jamaica': '🇯🇲',
      'trinidad-tobago': '🇹🇹'
    };
    return flags[country] || '🌍';
  };

  const getDeliveryMethodLabel = (method: string) => {
    const labels: { [key: string]: string } = {
      'bank-deposit': 'Bank Deposit',
      'cash-pickup': 'Cash Pickup',
      'mobile-wallet': 'Mobile Wallet (MonCash)',
      'home-delivery': 'Home Delivery'
    };
    return labels[method] || method;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: { [key: string]: string } = {
      'credit-card': 'Credit Card',
      'paypal': 'PayPal',
      'bank-transfer': 'Bank Transfer'
    };
    return labels[method] || method;
  };

  return (
    <div className="space-y-4">
      {/* Sender & Recipient Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Transfer Participants
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-1">Recipient</h4>
            <p className="text-base font-medium">
              {transferData.receiverDetails.firstName} {transferData.receiverDetails.lastName}
            </p>
            <p className="text-sm text-gray-600">{transferData.receiverDetails.phoneNumber}</p>
            <p className="text-sm text-gray-600">
              {transferData.receiverDetails.commune}, {transferData.receiverDetails.department}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Amount & Exchange Rate */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            Amount Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">You send</span>
            <span className="font-medium">${transferData.amount} USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transfer fee</span>
            <span className="font-medium">${transferFee.toFixed(2)} USD</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total amount</span>
            <span>${totalAmount.toFixed(2)} USD</span>
          </div>
          
          {transferData.transferType === 'international' && (
            <>
              <Separator />
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Exchange rate</span>
                  <span className="font-medium">1 USD = {exchangeRate} HTG</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">Recipient gets</span>
                  <span className="font-medium text-green-600">
                    {receivingAmount.toLocaleString()} HTG
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delivery Method */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Delivery Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Destination</span>
            <div className="flex items-center gap-2">
              <span>{getCountryFlag(transferData.transferDetails.receivingCountry)}</span>
              <span className="font-medium capitalize">
                {transferData.transferDetails.receivingCountry.replace('-', ' ')}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Delivery method</span>
            <Badge variant="secondary">
              {getDeliveryMethodLabel(transferData.transferDetails.deliveryMethod)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">You'll pay with</span>
            <Badge variant="outline">
              {transferData.transferType === 'national' 
                ? 'MonCash' 
                : getPaymentMethodLabel(transferData.selectedPaymentMethod || 'credit-card')
              }
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransferSummary;
