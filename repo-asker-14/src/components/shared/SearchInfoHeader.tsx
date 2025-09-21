import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SearchInfoHeaderProps {
  title?: string;
  className?: string;
  showViewMore?: boolean;
  onViewMoreClick?: () => void;
  viewMoreText?: string;
}

const SearchInfoHeader: React.FC<SearchInfoHeaderProps> = ({
  title = "Looking for specific info?",
  className = "",
  showViewMore = false,
  onViewMoreClick,
  viewMoreText = "View More"
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          {title}
        </h1>
      </div>

      {showViewMore && (
        <button
          onClick={onViewMoreClick}
          className="flex items-center gap-1.5 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          {viewMoreText}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInfoHeader;