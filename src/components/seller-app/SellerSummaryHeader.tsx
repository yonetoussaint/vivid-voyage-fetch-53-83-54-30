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
}

const SellerSummaryHeader: React.FC<SellerSummaryHeaderProps> = ({
  title,
  subtitle,
  stats,
  actionButton,
  showStats = true
}) => {
  return (
    <div className="bg-white">
      <div className="px-2 pt-3"> {/* Changed py-3 to pt-3 to remove bottom padding */}
        <div className="flex items-center justify-between"> {/* Removed mb-3 */}
          <div>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          {actionButton && (
            <Button size="sm" onClick={actionButton.onClick}>
              {actionButton.icon && <actionButton.icon className="w-4 h-4 mr-1" />}
              {actionButton.label}
            </Button>
          )}
        </div>

        {showStats && stats.length > 0 && (
          <div className={`grid grid-cols-${stats.length} gap-4 mt-3`}> {/* Added mt-3 instead of bottom margin */}
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-lg font-bold ${stat.color || 'text-blue-600'}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remove -mx-2 and let the border align naturally */}
      <div className="border-b"></div>
    </div>
  );
};

export default SellerSummaryHeader;