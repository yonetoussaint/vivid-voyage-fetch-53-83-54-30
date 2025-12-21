// components/common/ReusableSearchBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ScanLine, Mic, ArrowLeft, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReusableSearchBarProps {
  placeholder?: string;
  onSearchFocus?: () => void;
  onSearchClose?: () => void;
  showCloseButton?: boolean;
  showScanMic?: boolean;
  showSettingsButton?: boolean;
  onSettingsClick?: () => void;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (query: string) => void;
  // Add these new props for close functionality
  isOverlayOpen?: boolean;
  onCloseOverlay?: () => void;
  // New props for transparent state
  isTransparent?: boolean;
  onBackClick?: () => void;
  onShareClick?: () => void;
}

const ReusableSearchBar: React.FC<ReusableSearchBarProps> = ({
  placeholder = "Search for products",
  onSearchFocus,
  onSearchClose,
  showCloseButton = false,
  showScanMic = false,
  showSettingsButton = false,
  onSettingsClick,
  className = "",
  value = "",
  onChange,
  onSubmit,
  // New props
  isOverlayOpen = false,
  onCloseOverlay,
  // Transparent state props
  isTransparent = false,
  onBackClick,
  onShareClick
}) => {
  const [searchQuery, setSearchQuery] = useState(value);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  // Sync with external value
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSubmit?.(searchQuery.trim());
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onChange?.('');
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const handleFocus = () => {
    onSearchFocus?.();
  };

  const handleClose = () => {
    setSearchQuery('');
    onChange?.('');
    onSearchClose?.();
    // Call the overlay close function if provided
    onCloseOverlay?.();
  };

  const renderLeftIcons = () => {
    if (isTransparent) {
      return (
        <button
          type="button"
          onClick={onBackClick}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
      );
    }
    return null;
  };

  const renderRightIcons = () => {
    // Transparent state - show share icon
    if (isTransparent) {
      return (
        <button
          type="button"
          onClick={onShareClick}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <Share className="h-5 w-5 text-white" />
        </button>
      );
    }

    // When overlay is open and search is empty, show close button
    if (isOverlayOpen && !searchQuery.trim()) {
      return (
        <button
          type="button"
          onClick={handleClose}
          className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
        >
          Close
        </button>
      );
    }
    // Clear button when there's text (regardless of overlay state)
    else if (searchQuery.trim()) {
      return (
        <button
          type="button"
          onClick={handleClearSearch}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      );
    }
    // Scan + Mic icons when specified
    else if (showScanMic) {
      return (
        <>
          <ScanLine className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-800" />
          <Mic className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-800" />
        </>
      );
    }
    // Settings button when specified
    else if (showSettingsButton) {
      return (
        <button
          type="button"
          onClick={onSettingsClick}
          className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
        >
          Settings
        </button>
      );
    }

    return null;
  };

  // Transparent state styles
  const transparentStyles = isTransparent
    ? 'bg-transparent border-white/30 text-white placeholder-white/70'
    : 'bg-white border-gray-800 text-gray-900 placeholder-gray-500';

  return (
    <div className={`flex-1 relative max-w-full mx-auto ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            className={`w-full px-3 py-1 text-sm font-medium border-2 rounded-full transition-all duration-300 shadow-sm ${
              isTransparent ? 'pr-12 pl-10' : 'pr-16 pl-3'
            } ${transparentStyles}`}
            ref={searchRef}
          />

          {/* Left icons (back button in transparent mode) */}
          {isTransparent && (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              {renderLeftIcons()}
            </div>
          )}

          {/* Right icons */}
          <div className={`absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 ${
            isTransparent ? 'pr-1' : ''
          }`}>
            {renderRightIcons()}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReusableSearchBar;