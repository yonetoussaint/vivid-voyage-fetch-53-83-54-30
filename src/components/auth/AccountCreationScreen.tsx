import React, { useState } from 'react';
import AccountCreationNameStep from './AccountCreationNameStep';
import AccountCreationPasswordStep from './AccountCreationPasswordStep';
import AccountCreationSuccessStep from './AccountCreationSuccessStep';

interface AccountCreationScreenProps {
  email: string;
  onBack: () => void;
  onAccountCreated: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
}

type Step = 'name' | 'password' | 'success';

const AccountCreationScreen: React.FC<AccountCreationScreenProps> = ({
  email,
  onBack,
  onAccountCreated,
  isCompact = false,
  onExpand
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameStepContinue = (newFirstName: string, newLastName: string) => {
    setError(null);
    if (!newFirstName.trim() || !newLastName.trim()) {
      setError('First name and last name are required');
      return;
    }
    setFirstName(newFirstName.trim());
    setLastName(newLastName.trim());
    setCurrentStep('password');
  };

  const handlePasswordStepContinue = () => {
    setCurrentStep('success');
  };

  const handleChangeEmail = () => {
    onBack();
  };

  const handleNameStepBack = () => {
    onBack();
  };

  const handlePasswordStepBack = () => {
    setError(null);
    setCurrentStep('name');
  };

  const handleSuccessStepContinue = () => {
    onAccountCreated();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  const clearError = () => {
    setError(null);
  };

  const ErrorBanner = () => (
    error ? (
      <div className="fixed top-4 left-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-600 text-sm font-medium">
              {error}
            </div>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
          >
            ×
          </button>
        </div>
      </div>
    ) : null
  );

  if (currentStep === 'name') {
    return (
      <div> {/* REMOVED pb-6 */}
        <ErrorBanner />
        <AccountCreationNameStep
          email={email}
          onBack={handleNameStepBack}
          onChangeEmail={handleChangeEmail}
          onContinue={handleNameStepContinue}
          initialFirstName={firstName}
          initialLastName={lastName}
          isCompact={isCompact}
          onExpand={onExpand}
        />
      </div>
    );
  }

  if (currentStep === 'password') {
    return (
      <div> {/* REMOVED pb-6 */}
        <ErrorBanner />
        <AccountCreationPasswordStep
          email={email}
          firstName={firstName}
          lastName={lastName}
          onBack={handlePasswordStepBack}
          onContinue={handlePasswordStepContinue}
          onError={handleError}
          isLoading={isLoading}
          isCompact={isCompact}
          onExpand={onExpand}
        />
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <div> {/* REMOVED pb-6 */}
        <AccountCreationSuccessStep
          email={email}
          firstName={firstName}
          lastName={lastName}
          onContinue={handleSuccessStepContinue}
          isCompact={isCompact}
          onExpand={onExpand}
        />
      </div>
    );
  }

  return null;
};

export default AccountCreationScreen;