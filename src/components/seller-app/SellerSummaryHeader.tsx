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
  variant?: 'default' | 'dashed' | 'gradient' | 'multi-color' | 'minimal';
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  color = '#3b82f6',
  size = 70,
  strokeWidth = 8,
  variant = 'default'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getVariantStyles = () => {
    switch (variant) {
      case 'dashed':
        return {
          strokeDasharray: `${circumference / 20} ${circumference / 40}`,
          strokeLinecap: 'butt' as const
        };
      case 'minimal':
        return {
          strokeWidth: strokeWidth - 2,
          opacity: 0.8
        };
      default:
        return {};
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f3f4f6"
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
          className="transition-all duration-700 ease-out"
          {...variantStyles}
        />
        {variant === 'gradient' && (
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        )}
        {variant === 'multi-color' && (
          <defs>
            <linearGradient id="multiColor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        )}
      </svg>
    </div>
  );
};

interface SellerSummaryHeaderProps {
  title: string;
  subtitle: string;
  stats: StatItem[];
  progressPercentage?: number;
  progressColor?: string;
  progressVariant?: 'default' | 'dashed' | 'gradient' | 'multi-color' | 'minimal';
  showStats?: boolean;
  className?: string;
}

// Mock data for demonstration
const mockStats: StatItem[] = [
  { value: '24', label: 'Active Listings', color: 'text-green-600' },
  { value: '1.2k', label: 'Monthly Views', color: 'text-blue-600' },
  { value: '89', label: 'Sold Items', color: 'text-purple-600' },
  { value: '4.8', label: 'Rating', color: 'text-yellow-600' }
];

const SellerSummaryHeader: React.FC<SellerSummaryHeaderProps> = ({
  title = "Seller Dashboard",
  subtitle = "Overview of your store performance and statistics",
  stats = mockStats,
  progressPercentage = 75,
  progressColor = '#3b82f6',
  progressVariant = 'default',
  showStats = true,
  className = ''
}) => {
  return (
    <div className={`bg-white border-b ${className}`}>
      <div className="px-2 py-2">
        {/* Header row with balanced visual weight */}
        <div className="flex items-start justify-between">
          {/* Title section - takes about 70% of width */}
          <div className="min-w-0 flex-1 pr-4">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{subtitle}</p>
          </div>

          {/* Circular diagram section - takes about 30% of width */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center">
            <CircularProgress 
              percentage={progressPercentage} 
              color={progressColor}
              variant={progressVariant}
              size={70}
              strokeWidth={8}
            />
            <span className="text-xs text-gray-500 mt-2 text-center leading-tight">
              Completion
            </span>
          </div>
        </div>

        {/* Stats section */}
        {showStats && stats.length > 0 && (
          <div className={`grid grid-cols-4 gap-3 mt-4`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-lg font-bold ${stat.color || 'text-blue-600'}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerSummaryHeader;