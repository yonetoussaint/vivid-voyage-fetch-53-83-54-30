# Overview

Mima is a modern e-commerce platform designed specifically for the Haitian market. Built as a progressive web app using React and TypeScript, it provides a comprehensive marketplace experience with features like product discovery, shopping, media content (videos/reels), digital services, and financial transactions. The platform supports multiple languages including Haitian Creole and integrates with PayPal for payments, making it accessible to both local and international users.

# Recent Changes

## October 5, 2025 - Enhanced Real-time Messaging System
**Enhancement**: Completely overhauled the messaging system to ensure reliable real-time message delivery with Supabase real-time subscriptions.

**Improvements Made**:
1. **Fast Real-time Delivery**: Messages appear instantly via Supabase's real-time subscriptions (typically <100ms)
2. **Connection Status Tracking**: Added visual "Live" indicator showing when real-time connection is active
3. **Automatic Retry Logic**: Subscriptions automatically retry on failure with 3-second backoff
4. **Better Error Handling**: Improved error states with clear console logging for debugging
5. **Duplicate Prevention**: Smart deduplication ensures messages aren't added twice
6. **Clean Architecture**: Simplified implementation without optimistic updates for maximum reliability

**Files Modified**:
- `src/hooks/useMessages.ts`: Enhanced with connection status, retry logic, and robust duplicate prevention
- `src/hooks/useConversations.ts`: Enhanced with connection tracking and automatic retry mechanisms
- `src/pages/ConversationDetail.tsx`: Added live connection indicator in header

**Technical Details**:
- **Real-time Subscriptions**: Direct subscription to Supabase INSERT/UPDATE events on messages table
- **Connection Management**: Uses refs to manage subscription channels with proper cleanup on unmount
- **Retry Strategy**: 3-second delay before retrying failed subscriptions, prevents subscription leaks
- **Duplicate Prevention**: Checks message ID before adding to prevent duplicates from race conditions
- **State Management**: Uses React callbacks to prevent dependency issues and stale closures

## October 5, 2025 - Messaging System Real-time Fix (Earlier)
**Issue Fixed**: When users started new conversations and sent messages, the recipient wouldn't see the conversation appear in real-time until they refreshed the page.

**Root Cause**: The `useConversations` hook was only subscribed to `messages` and `conversations` table changes. When a new conversation was created, Supabase's Row Level Security (RLS) blocked the recipient from seeing the initial conversation INSERT event because their participant record wasn't written yet.

**Solution**: Added a real-time subscription to the `conversation_participants` table filtered by the current user's ID. Now when a user is added to a new conversation, their subscription detects the participant INSERT event and automatically refetches their conversations list, showing the new conversation immediately.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern component-based architecture using functional components and hooks
- **Vite Build System**: Fast development server and optimized production builds
- **Progressive Web App**: Configured with Capacitor for mobile app deployment (iOS/Android)
- **Responsive Design**: Mobile-first approach using Tailwind CSS with custom design system
- **State Management**: React Query for server state, React Context for global client state
- **Routing**: React Router for client-side navigation with protected routes

## UI Component System
- **Radix UI**: Accessible, unstyled component primitives as foundation
- **Shadcn/ui**: Pre-built component library built on top of Radix UI
- **Custom Design System**: Tailwind configuration with custom color palette and component variants
- **Theme Support**: Light/dark theme switching with next-themes
- **Responsive Grid System**: Container-based layout with mobile-first breakpoints

## Internationalization
- **i18next**: Full internationalization support with namespace organization
- **Multi-language Support**: English, Spanish, French, and Haitian Creole
- **Dynamic Language Switching**: Real-time language changes without page reload
- **Localized Content**: Separate translation files organized by feature

## Data Management
- **Supabase Integration**: PostgreSQL database with real-time subscriptions
- **React Query**: Caching, synchronization, and background updates for API data
- **Optimistic Updates**: Immediate UI feedback with rollback on errors
- **Real-time Features**: Live product updates, chat, and notifications

## Media and Content
- **Video Platform**: Support for reels, entertainment content with custom video player
- **Image Management**: Supabase storage for product images with optimization
- **3D Model Support**: Three.js integration for 3D product visualization
- **Content Delivery**: Optimized asset loading with lazy loading and caching

# External Dependencies

## Payment Processing
- **PayPal SDK**: Full integration including hosted fields, buttons, and checkout flows
- **Multi-currency Support**: HTG, HTD, and USD with automatic conversion
- **Payment Methods**: Credit cards, PayPal, and local payment solutions
- **Transaction Security**: PCI-compliant payment processing

## Database and Backend
- **Supabase**: Backend-as-a-Service providing PostgreSQL database, authentication, real-time subscriptions, and file storage
- **Database Schema**: Products, users, orders, reviews, sellers, categories, and media content
- **Row Level Security**: Secure data access patterns with user-based permissions
- **File Storage**: Supabase storage buckets for images, videos, and documents

## Mobile and Cross-Platform
- **Capacitor**: Native app deployment for iOS and Android
- **Progressive Web App**: Service worker integration for offline functionality
- **Mobile Optimization**: Touch-friendly interfaces and mobile-specific features
- **Cross-platform Compatibility**: Consistent experience across web and mobile

## Development and Build Tools
- **TypeScript**: Type safety and improved developer experience
- **ESLint**: Code quality and consistency enforcement
- **Vite**: Fast development server with hot module replacement
- **PostCSS**: CSS processing with Tailwind CSS and autoprefixer

## Third-party Services
- **Analytics Integration**: Ready for Google Analytics or similar services
- **Email Services**: Integration points for transactional emails
- **CDN Support**: Optimized for content delivery networks
- **Monitoring**: Error tracking and performance monitoring integration points