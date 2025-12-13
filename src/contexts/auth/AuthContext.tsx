// Re-export from Providers to ensure single source of truth
export { useAuth } from '@/components/Providers';
export type { AuthContextType } from '@/components/Providers';

// For backwards compatibility, also export AuthProvider (though it's not used directly)
import React from 'react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // This is a pass-through - the actual provider is in Providers.tsx
  return <>{children}</>;
};
