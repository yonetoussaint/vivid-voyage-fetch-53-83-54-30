
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Building, Smartphone, DollarSign } from 'lucide-react';

interface TransferDetails {
  receivingCountry: string;
  deliveryMethod: string;
}

interface StepOnePointFiveTransferProps {
  transferDetails: TransferDetails;
  onTransferDetailsChange: (details: TransferDetails) => void;
}

const StepOnePointFiveTransfer: React.FC<StepOnePointFiveTransferProps> = ({
  transferDetails,
  onTransferDetailsChange
}) => {
  // Automatically set Haiti as the receiving country
  useEffect(() => {
    if (transferDetails.receivingCountry !== 'haiti') {
      onTransferDetailsChange({
        ...transferDetails,
        receivingCountry: 'haiti'
      });
    }
  }, [transferDetails, onTransferDetailsChange]);

  const deliveryMethods = [
    {
      id: 'moncash',
      title: 'MonCash',
      description: 'Direct to MonCash mobile wallet',
      icon: Smartphone,
      popular: true
    },
    {
      id: 'natcash',
      title: 'NatCash',
      description: 'Direct to NatCash account',
      icon: DollarSign,
      popular: false
    },
    {
      id: 'cash-pickup',
      title: 'Cash Pickup',
      description: 'Coming soon',
      icon: MapPin,
      popular: false,
      disabled: true
    }
  ];

  const handleDeliveryMethodChange = (method: string) => {
    onTransferDetailsChange({
      ...transferDetails,
      deliveryMethod: method
    });
  };

  return (
    <div className="space-y-6">
      {/* Delivery Method Selection */}
      <div className="space-y-3">
        <div className="space-y-3">
           {deliveryMethods.map((method) => {
             const IconComponent = method.icon;
             const isDisabled = method.disabled;
             return (
               <Card
                 key={method.id}
                 className={`transition-all duration-200 ${
                   isDisabled 
                     ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50' 
                     : `cursor-pointer hover:shadow-md ${
                         transferDetails.deliveryMethod === method.id
                           ? 'border-red-500 bg-red-50'
                           : 'border-gray-200 hover:border-gray-300'
                       }`
                 }`}
                 onClick={() => !isDisabled && handleDeliveryMethodChange(method.id)}
               >
                 <CardContent className="p-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                       <div className={`p-2 rounded-lg ${
                         isDisabled
                           ? 'bg-gray-100 text-gray-400'
                           : transferDetails.deliveryMethod === method.id
                             ? 'bg-red-100 text-red-600'
                             : 'bg-gray-100 text-gray-600'
                       }`}>
                         <IconComponent className="h-5 w-5" />
                       </div>
                       <div>
                         <div className="flex items-center space-x-2">
                           <span className={`font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                             {method.title}
                           </span>
                           {method.popular && !isDisabled && (
                             <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                               Popular
                             </span>
                           )}
                           {isDisabled && (
                             <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                               Coming Soon
                             </span>
                           )}
                         </div>
                         <p className={`text-sm mt-1 ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                           {method.description}
                         </p>
                       </div>
                     </div>
                     <div className={`w-4 h-4 rounded-full border-2 ${
                       isDisabled
                         ? 'border-gray-300'
                         : transferDetails.deliveryMethod === method.id
                           ? 'border-red-500 bg-red-500'
                           : 'border-gray-300'
                     }`}>
                       {transferDetails.deliveryMethod === method.id && !isDisabled && (
                         <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                       )}
                     </div>
                   </div>
                 </CardContent>
               </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepOnePointFiveTransfer;
