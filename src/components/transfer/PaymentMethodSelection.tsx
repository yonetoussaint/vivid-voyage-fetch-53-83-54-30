import React from 'react';
import { CreditCard, Building, Smartphone, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentMethodSelectionProps {
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
  transferType?: 'national' | 'international';
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  selectedMethod,
  onMethodSelect,
  transferType = 'international'
}) => {
  // Payment methods for international transfers
  const internationalPaymentMethods = [
    {
      id: 'credit-card',
      title: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      popular: true
    },
    {
      id: 'bank-account',
      title: 'ACH / Bank Account',
      description: 'Direct bank transfer',
      icon: Building,
      popular: false
    },
    {
      id: 'mobile-pay',
      title: 'Apple Pay / Google Pay',
      description: 'Quick mobile payment',
      icon: Smartphone,
      popular: false
    },
    {
      id: 'paypal',
      title: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: DollarSign,
      popular: false
    }
  ];

  // Payment methods for national transfers
  const nationalPaymentMethods = [
    {
      id: 'moncash',
      title: 'MonCash',
      description: 'Pay with your MonCash mobile wallet',
      icon: Smartphone,
      popular: true
    },
    {
      id: 'natcash',
      title: 'NatCash',
      description: 'Pay with your NatCash account',
      icon: DollarSign,
      popular: false
    }
  ];

  const paymentMethods = transferType === 'national' ? nationalPaymentMethods : internationalPaymentMethods;

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedMethod === method.id
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onMethodSelect(method.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedMethod === method.id
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {method.title}
                        </span>
                        {method.popular && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedMethod === method.id
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === method.id && (
                      <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};

export default PaymentMethodSelection;