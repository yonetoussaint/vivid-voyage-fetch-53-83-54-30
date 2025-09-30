import React, { useState } from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft, User, Phone, AlertCircle } from 'lucide-react';

interface ReceiverDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  department: string;
  commune: string;
  email?: string;
  moncashPhoneNumber?: string;
}

interface StepTwoTransferProps {
  receiverDetails: ReceiverDetails;
  onDetailsChange: (details: ReceiverDetails) => void;
  transferDetails?: {
    deliveryMethod: string;
  };
  onBack?: () => void;
  onContinue?: () => void;
}

const StepTwoTransfer: React.FC<StepTwoTransferProps> = ({ 
  receiverDetails, 
  onDetailsChange,
  transferDetails,
  onBack,
  onContinue
}) => {
  const handleInputChange = (field: keyof ReceiverDetails, value: string) => {
    const updatedDetails = {
      ...receiverDetails,
      [field]: value,
    };
    onDetailsChange(updatedDetails);
  };

  const isMonCashOrNatCash = transferDetails?.deliveryMethod === 'moncash' || transferDetails?.deliveryMethod === 'natcash';
  const paymentMethod = transferDetails?.deliveryMethod === 'moncash' ? 'MonCash' : 'NatCash';

  const isFormValid = receiverDetails.firstName.trim().length > 0 && 
                     receiverDetails.lastName.trim().length > 0 && 
                     (isMonCashOrNatCash ? 
                       (receiverDetails.moncashPhoneNumber && receiverDetails.moncashPhoneNumber.trim().length > 0) :
                       receiverDetails.phoneNumber.trim().length > 0);

  return (
    <div className="min-h-screen bg-white flex flex-col px-0"> {/* Reduced padding here */}
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">
            Who's receiving this?
          </h1>
          <p className="text-sm text-gray-600">
            Please provide the recipient's information
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-3 mb-6">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="firstName"
                  type="text"
                  value={receiverDetails.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="lastName"
                  type="text"
                  value={receiverDetails.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Regular Phone Number */}
          {!isMonCashOrNatCash && (
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <div className="absolute left-10 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                  <span className="text-gray-500 text-sm font-medium">+509</span>
                </div>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={receiverDetails.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter phone number"
                  className="pl-20"
                />
              </div>
            </div>
          )}

          {/* MonCash/NatCash Phone Number */}
          {isMonCashOrNatCash && (
            <div>
              <label htmlFor="moncashPhoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                {paymentMethod} Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <div className="absolute left-10 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                  <span className="text-gray-500 text-sm font-medium">+509</span>
                </div>
                <Input
                  id="moncashPhoneNumber"
                  type="tel"
                  value={receiverDetails.moncashPhoneNumber || ''}
                  onChange={(e) => handleInputChange('moncashPhoneNumber', e.target.value)}
                  placeholder={`Enter ${paymentMethod} phone number`}
                  className="pl-20"
                />
              </div>
            </div>
          )}
        </div>

        {/* Important Notice for MonCash/NatCash */}
        {isMonCashOrNatCash && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important Notice</p>
                <p>
                  Please ensure the {paymentMethod} phone number is eligible to receive payments and the account is upgraded. 
                  Unverified or basic accounts may not be able to receive transfers.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StepTwoTransfer;