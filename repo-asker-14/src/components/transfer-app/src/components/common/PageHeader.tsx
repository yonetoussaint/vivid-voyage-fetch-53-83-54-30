import React from 'react';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  showBackButton = true,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="bg-white">
      <div className="px-2 py-2">
        {/* Row 1: Icons + Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center w-10">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-10 h-10 bg-transparent text-gray-600"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-semibold text-gray-900 text-center">
              {title}
            </h1>
          </div>
          <div className="flex items-center w-10 justify-end">
            <button
              className="flex items-center justify-center w-10 h-10 bg-transparent text-gray-600"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Row 2: Subtitle/Description */}
        {subtitle && (
          <div className="flex justify-center mt-1">
            <p className="text-sm text-gray-600 text-center max-w-xl">{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;