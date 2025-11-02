import React from 'react';

interface InventoryItem {
  value: string | number;
  label: string;
  color?: string;
  status?: 'low' | 'medium' | 'high' | 'out-of-stock';
}

interface CircularInventoryProgressProps {
  percentage: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
  variant?: 'stock-level' | 'category' | 'turnover' | 'capacity';
  label?: string;
  status?: 'low' | 'medium' | 'high' | 'out-of-stock';
}

const CircularInventoryProgress: React.FC<CircularInventoryProgressProps> = ({
  percentage,
  color,
  size = 70,
  strokeWidth = 8,
  variant = 'stock-level',
  label = 'Stock Level',
  status = 'medium'
}) => {
  // Determine color based on variant and status
  const getProgressColor = () => {
    if (color) return color;
    
    switch (variant) {
      case 'stock-level':
        switch (status) {
          case 'low': return '#ef4444';
          case 'medium': return '#eab308';
          case 'high': return '#22c55e';
          case 'out-of-stock': return '#6b7280';
          default: return '#3b82f6';
        }
      case 'capacity':
        return percentage > 90 ? '#ef4444' : percentage > 70 ? '#eab308' : '#22c55e';
      case 'turnover':
        return '#8b5cf6';
      case 'category':
        return '#10b981';
      default:
        return '#3b82f6';
    }
  };

  const progressColor = getProgressColor();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStatusIcon = () => {
    if (variant !== 'stock-level') return null;
    
    switch (status) {
      case 'low': return '⚠️';
      case 'out-of-stock': return '❌';
      case 'high': return '✅';
      default: return null;
    }
  };

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
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {getStatusIcon() && (
          <span className="text-xs mb-1">{getStatusIcon()}</span>
        )}
        <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

// Mock inventory data
const mockInventoryStats: InventoryItem[] = [
  { value: '1,248', label: 'Total Items', color: 'text-blue-600' },
  { value: '47', label: 'Low Stock', color: 'text-red-600', status: 'low' },
  { value: '92%', label: 'Availability', color: 'text-green-600' },
  { value: '28', label: 'Categories', color: 'text-purple-600' }
];

interface InventorySummaryHeaderProps {
  title?: string;
  subtitle?: string;
  stats?: InventoryItem[];
  progressPercentage?: number;
  progressVariant?: 'stock-level' | 'category' | 'turnover' | 'capacity';
  progressStatus?: 'low' | 'medium' | 'high' | 'out-of-stock';
  className?: string;
}

const InventorySummaryHeader: React.FC<InventorySummaryHeaderProps> = ({
  title = "Inventory Overview",
  subtitle = "Manage your stock levels and product availability",
  stats = mockInventoryStats,
  progressPercentage = 65,
  progressVariant = 'stock-level',
  progressStatus = 'medium',
  className = ''
}) => {
  const getProgressLabel = () => {
    switch (progressVariant) {
      case 'stock-level': return 'Stock Level';
      case 'capacity': return 'Capacity Used';
      case 'turnover': return 'Turnover Rate';
      case 'category': return 'Category Fill';
      default: return 'Progress';
    }
  };

  return (
    <div className={`bg-white border-b ${className}`}>
      <div className="px-2 py-2">
        {/* Header row */}
        <div className="flex items-start justify-between">
          {/* Title section */}
          <div className="min-w-0 flex-1 pr-4">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{subtitle}</p>
          </div>

          {/* Inventory progress diagram */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center">
            <CircularInventoryProgress 
              percentage={progressPercentage}
              variant={progressVariant}
              status={progressStatus}
              size={70}
              strokeWidth={8}
            />
            <span className="text-xs text-gray-500 mt-2 text-center leading-tight">
              {getProgressLabel()}
            </span>
          </div>
        </div>

        {/* Inventory stats section */}
        {stats.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mt-4">
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

export default InventorySummaryHeader;