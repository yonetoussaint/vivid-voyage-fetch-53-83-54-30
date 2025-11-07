import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const MainLoginScreenSkeleton = () => (
  <div className="p-6 space-y-6">
    {/* Logo skeleton */}
    <div className="flex justify-center mb-8">
      <Skeleton className="h-16 w-16 rounded-full" />
    </div>
    
    {/* Title skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-64 mx-auto" />
    </div>
    
    {/* Social buttons skeleton */}
    <div className="space-y-3 mt-6">
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
    
    {/* Divider skeleton */}
    <div className="flex items-center gap-3 my-6">
      <Skeleton className="h-px flex-1" />
      <Skeleton className="h-4 w-8" />
      <Skeleton className="h-px flex-1" />
    </div>
    
    {/* Email button skeleton */}
    <Skeleton className="h-12 w-full rounded-lg" />
    
    {/* Footer text skeleton */}
    <div className="flex justify-center gap-1 mt-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export const EmailAuthScreenSkeleton = () => (
  <div className="p-6 space-y-6">
    {/* Back button skeleton */}
    <Skeleton className="h-10 w-10 rounded-full" />
    
    {/* Title skeleton */}
    <div className="space-y-2 mt-4">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-64" />
    </div>
    
    {/* Email input skeleton */}
    <div className="space-y-2 mt-6">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
    
    {/* Continue button skeleton */}
    <Skeleton className="h-12 w-full rounded-lg mt-4" />
    
    {/* Footer text skeleton */}
    <div className="flex justify-center gap-1 mt-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const VerificationCodeScreenSkeleton = () => (
  <div className="p-6 space-y-6">
    {/* Back button skeleton */}
    <Skeleton className="h-10 w-10 rounded-full" />
    
    {/* Title skeleton */}
    <div className="space-y-2 mt-4">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-56" />
    </div>
    
    {/* OTP input boxes skeleton */}
    <div className="flex justify-center gap-2 mt-8">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-14 w-12 rounded-lg" />
      ))}
    </div>
    
    {/* Verify button skeleton */}
    <Skeleton className="h-12 w-full rounded-lg mt-6" />
    
    {/* Resend text skeleton */}
    <div className="flex justify-center gap-1 mt-4">
      <Skeleton className="h-4 w-40" />
    </div>
  </div>
);

export const PasswordAuthScreenSkeleton = () => (
  <div className="p-6 space-y-6">
    {/* Back button skeleton */}
    <Skeleton className="h-10 w-10 rounded-full" />
    
    {/* Title skeleton */}
    <div className="space-y-2 mt-4">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-4 w-48" />
    </div>
    
    {/* Password input skeleton */}
    <div className="space-y-2 mt-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
    
    {/* Forgot password skeleton */}
    <Skeleton className="h-4 w-36 ml-auto" />
    
    {/* Sign in button skeleton */}
    <Skeleton className="h-12 w-full rounded-lg mt-4" />
  </div>
);

export const ResetPasswordScreenSkeleton = () => (
  <div className="p-6 space-y-6">
    {/* Back button skeleton */}
    <Skeleton className="h-10 w-10 rounded-full" />
    
    {/* Title skeleton */}
    <div className="space-y-2 mt-4">
      <Skeleton className="h-7 w-44" />
      <Skeleton className="h-4 w-64" />
    </div>
    
    {/* Email input skeleton */}
    <div className="space-y-2 mt-6">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
    
    {/* Send code button skeleton */}
    <Skeleton className="h-12 w-full rounded-lg mt-4" />
  </div>
);

export const AccountCreationScreenSkeleton = () => (
  <div className="p-6 space-y-6">
    {/* Back button skeleton */}
    <Skeleton className="h-10 w-10 rounded-full" />
    
    {/* Title skeleton */}
    <div className="space-y-2 mt-4">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-56" />
    </div>
    
    {/* Form fields skeleton */}
    <div className="space-y-4 mt-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
    
    {/* Create account button skeleton */}
    <Skeleton className="h-12 w-full rounded-lg mt-4" />
    
    {/* Terms text skeleton */}
    <div className="flex justify-center mt-4">
      <Skeleton className="h-3 w-64" />
    </div>
  </div>
);

export const SuccessScreenSkeleton = () => (
  <div className="p-6 space-y-6 flex flex-col items-center">
    {/* Success icon skeleton */}
    <Skeleton className="h-20 w-20 rounded-full mt-8" />
    
    {/* Title skeleton */}
    <div className="space-y-2 flex flex-col items-center">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    
    {/* Continue button skeleton */}
    <Skeleton className="h-12 w-full rounded-lg mt-6" />
  </div>
);
