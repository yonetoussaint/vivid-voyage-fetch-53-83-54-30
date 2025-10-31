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
      {/* Reduced vertical padding and removed horizontal padding constraint */}
      <div className="px-4 py-2"> {/* Changed from py-3 to py-2 */}
        <div className="flex items-center justify-between mb-2"> {/* Reduced mb-3 to mb-2 */}
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">{title}</h1> {/* Added leading-tight */}
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p> {/* Added small top margin */}
          </div>
          {actionButton && (
            <Button size="sm" onClick={actionButton.onClick}>
              {actionButton.icon && <actionButton.icon className="w-4 h-4 mr-1" />}
              {actionButton.label}
            </Button>
          )}
        </div>

        {showStats && stats.length > 0 && (
          <div className={`grid grid-cols-${stats.length} gap-3 mt-2`}> {/* Added mt-2 and reduced gap */}
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

      <div className="border-b"></div>
    </div>
  );
};

export default SellerSummaryHeader;