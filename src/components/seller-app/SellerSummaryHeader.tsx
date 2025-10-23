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
          <div className={`grid gap-3 ${
            stats.length === 3 ? 'grid-cols-3' :
            stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' :
            stats.length === 5 ? 'grid-cols-5' :
            stats.length === 6 ? 'grid-cols-3 sm:grid-cols-3 md:grid-cols-6' :
            'grid-cols-3 sm:grid-cols-4 md:grid-cols-6'
          }`}>
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

      {/* Apply -mx-2 only to the bottom border */}
      <div className="border-b -mx-2"></div>
    </div>
  );
};

export default SellerSummaryHeader;