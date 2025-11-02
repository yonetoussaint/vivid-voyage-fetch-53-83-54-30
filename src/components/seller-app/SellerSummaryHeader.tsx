import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatItem {
  value: string | number;
  label: string;
  color?: string;
}

interface CircularProgressProps {
  percentage: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  color = '#3b82f6',
  size = 60,
  strokeWidth = 6
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

interface SellerSummaryHeaderProps {
  title: string;
  subtitle: string;
  stats: StatItem[];
  progressPercentage?: number;
  progressColor?: string;
  showStats?: boolean;
  className?: string;
}

const SellerSummaryHeader: React.FC<SellerSummaryHeaderProps> = ({
  title,
  subtitle,
  stats,
  progressPercentage = 0,
  progressColor = '#3b82f6',
  showStats = true,
  className = ''
}) => {
  return (
    <div className={`bg-white border-b ${className}`}>
      {/* Main container with tight padding */}
      <div className="px-2 py-2">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-foreground leading-tight">{title}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>

          {/* Circular percentage diagram */}
          <div className="ml-2 flex-shrink-0 flex flex-col items-center">
            <CircularProgress 
              percentage={progressPercentage} 
              color={progressColor}
            />
            <span className="text-xs text-muted-foreground mt-1 text-center">
              Progress
            </span>
          </div>
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