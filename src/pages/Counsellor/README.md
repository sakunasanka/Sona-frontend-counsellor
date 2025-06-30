# CounsellorProfile Component Refactoring

This directory contains the refactored CounsellorProfile component, which has been broken down into smaller, more manageable components for better maintainability and code organization.

## Structure

### Main Files
- `CounsellorProfile.tsx` - Main component (now simplified to ~200 lines)
- `types.ts` - TypeScript interfaces and types
- `hooks.ts` - Custom hooks for state management and business logic

### Components (`/components`)
- `StatusIndicator.tsx` - Status dropdown component
- `ProfileStats.tsx` - Profile statistics display
- `TabNavigation.tsx` - Tab navigation component
- `ProfileHeader.tsx` - Profile header with cover/profile images
- `ProfileInfo.tsx` - Profile information and social links
- `OverviewTab.tsx` - Overview tab content with specializations and languages
- `CredentialsTab.tsx` - Credentials management tab
- `AchievementsTab.tsx` - Achievements management tab
- `index.ts` - Component exports

## Benefits

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the application
3. **Maintainability**: Easier to debug and modify specific functionality
4. **Readability**: Smaller components are easier to understand
5. **Testing**: Individual components can be tested in isolation
6. **Performance**: Better tree-shaking and potential for lazy loading

## Features

### Credentials Management
- Add new professional credentials
- Edit existing credentials (requires re-approval)
- Delete credentials
- Admin approval workflow with pending status
- Year validation
- Visual status indicators (approved vs pending)

### Achievements Management
- Add new achievements and awards
- Edit existing achievements (requires re-approval)
- Delete achievements
- Admin approval workflow with pending status
- Year validation
- Visual status indicators (approved vs pending)

### Profile Management
- Real-time status updates (Available, Busy, Offline)
- Cover and profile image management
- Social media links integration
- Languages and specializations management
- Comprehensive profile statistics

## Usage

The main `CounsellorProfile` component now uses these smaller components internally, maintaining the same external API and functionality while being much more organized internally.

```tsx
import CounsellorProfile from './pages/Counsellor/CounsellorProfile';
```

The component maintains all original functionality including:
- Profile editing
- Image uploads
- Status management
- Language and specialization management
- **Credentials management with admin approval workflow**
- **Achievements management with admin approval workflow**
- Responsive design
- All interactive features
