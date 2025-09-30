# Auth SDK

A React authentication SDK with OAuth and email/password support.

## Installation

```bash
npm install @your-org/auth-sdk
```

## Peer Dependencies

Make sure you have these installed in your project:

```bash
npm install react react-dom react-router-dom
```

## Usage

### Basic Setup

```tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, SignInScreen, useAuth } from '@your-org/auth-sdk';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MyApp />
      </AuthProvider>
    </BrowserRouter>
  );
}

function MyApp() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default App;
```

### Available Components

- `SignInScreen` - Main login screen
- `EmailAuthScreen` - Email authentication
- `PasswordAuthScreen` - Password entry
- `VerificationCodeScreen` - OTP verification
- `AccountCreationScreen` - Account creation flow
- `SuccessScreen` - Success confirmation
- `AuthProvider` - Context provider

### Available Hooks

- `useAuth()` - Access authentication state and methods
- `useEmailValidation()` - Email validation utilities

### Backend Configuration

Update the backend URL in your environment:

```tsx
// In your app, before using the SDK
import { authService } from '@your-org/auth-sdk';

// The SDK expects your backend to have these endpoints:
// POST /signin - Email/password login
// GET /verify-token - Token verification
// POST /auth/logout - Logout
```

## API

### AuthProvider Props

The AuthProvider component wraps your app and provides authentication context.

### useAuth Hook

```tsx
const {
  user,           // Current user object
  isAuthenticated, // Boolean auth status
  isLoading,      // Loading state
  login,          // Login function
  logout,         // Logout function
  checkAuthStatus // Check current auth status
} = useAuth();
```

## License

MIT