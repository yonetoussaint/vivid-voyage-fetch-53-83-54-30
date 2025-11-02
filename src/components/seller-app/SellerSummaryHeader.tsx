import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface StatItem {
  value: string | number;
  label: string;
  color?: string;
}

interface ActionButton {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
}

interface SellerSummaryHeaderProps {
  title: string;
  subtitle: string;
  stats: StatItem[];
  actionButton?: ActionButton;
  showStats?: boolean;
  className?: string;
}

const SellerSummaryHeader: React.FC<SellerSummaryHeaderProps> = ({
  title,
  subtitle,
  stats,
  actionButton,
  showStats = true,
  className = ''
}) => {
  return (
    <div className={`bg-white border-b ${className}`}>
      {/* Main container with tight padding */}
      <div className="px-2 py-2"> {/* Changed mb-2 to py-2 for consistent padding */}
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1"> {/* Added flex-1 for better text handling */}
            <h1 className="text-lg font-bold text-foreground leading-tight">{title}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p> {/* Reduced margin */}
          </div>

          {actionButton && (
            <Button 
              size="sm" 
              onClick={actionButton.onClick}
              className="ml-2 flex-shrink-0" /* Prevent button from shrinking */
            >
              {actionButton.icon && <actionButton.icon className="w-4 h-4 mr-1" />}
              {actionButton.label}
            </Button>
          )}
        </div>

        {/* Stats section */}
        {showStats && stats.length > 0 && (
          <div className={`grid grid-cols-${stats.length} gap-3 mt-3`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-lg font-bold ${stat.color || 'text-blue-600'}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerSummaryHeader;