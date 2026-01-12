// components/profile/ProfileHeader.tsx
import React from 'react';
import { ChevronLeft, Settings, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';

interface ProfileHeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  onSettingsClick?: () => void;
  user?: {
    name?: string;
    avatar?: string;
    isVerified?: boolean;
  };
}

export default function ProfileHeader({
  showBackButton,
  onBackClick,
  onSettingsClick,
  user: propUser,
}: ProfileHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();
  
  // Use prop user or auth user
  const user = propUser || authUser;
  
  const isNestedRoute = location.pathname !== '/profile' && location.pathname.startsWith('/profile/');

  // Default handlers
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      navigate('/settings');
    }
  };

  // Determine if we should show back button
  const shouldShowBackButton = showBackButton ?? isNestedRoute;

  // Default user data if not available
  const displayName = user?.name || 'My Profile';
  const displayAvatar = user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=profile';
  const isVerified = user?.isVerified || false;

  return (
    <header className="fixed top-0 w-full z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left section: Back button */}
        <div className="flex items-center flex-shrink-0 min-w-[40px]">
          {shouldShowBackButton ? (
            <button
              onClick={handleBackClick}
              className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
          ) : (
            <div className="w-10" /> // Spacer for alignment
          )}
        </div>

        {/* Center section: Profile info */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="flex items-center gap-3 max-w-full">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=profile';
                  }}
                />
              </div>
            </div>

            {/* Name and Verification */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-base font-medium text-gray-900 truncate">
                {displayName}
              </span>
              
              {/* Verification Badge */}
              {isVerified && (
                <div className="flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-blue-500" fill="currentColor" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right section: Settings icon */}
        <div className="flex items-center flex-shrink-0 min-w-[40px] justify-end">
          <button
            onClick={handleSettingsClick}
            className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}