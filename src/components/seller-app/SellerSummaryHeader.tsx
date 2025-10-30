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
      <div className="py-3">
        <div className="flex items-center justify-between mb-3">
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
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {stats.map((stat, index) => (
              <div key={index} className="text-center flex-shrink-0">
                <div className={`text-lg font-bold ${stat.color || 'text-blue-600'}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply -mx-2 only to the bottom border */}
      <div className="border-b -mx-2"></div>
    </div>
  );
};

export default SellerSummaryHeader;