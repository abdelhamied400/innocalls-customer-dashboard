# Phone History Modal

This module contains the PhoneHistoryModal component and its related subcomponents, organized in a clean, modular structure.

## Structure

```
phone-history/
├── PhoneHistoryModal.tsx          # Main modal component
├── index.ts                       # Module exports
├── types.ts                       # TypeScript type definitions
├── components/
│   ├── index.ts                   # Component exports
│   ├── Badges.tsx                 # DirectionBadge, CallAnsweredBadge
│   ├── Cells.tsx                  # DateTime, ExtCell components
│   ├── RecordingCell.tsx          # Recording playback component
│   ├── StateComponents.tsx        # LoadingSpinner, ErrorMessage, EmptyState
│   └── PhoneHistoryTableBody.tsx  # Custom table body with expansion
└── hooks/
    ├── index.ts                   # Hook exports
    └── usePhoneHistoryColumns.tsx # Table column definitions
```

## Components

### PhoneHistoryModal

Main modal component that manages state and orchestrates the phone history display.

### Badges

- `DirectionBadge`: Displays call direction (incoming/outgoing) with appropriate styling
- `CallAnsweredBadge`: Shows if a call was answered with color-coded badges

### Cells

- `DateTime`: Displays date and time in a formatted layout
- `ExtCell`: Shows extension number and name

### RecordingCell

Handles call recording playback with a play button that opens a dialog with audio player.

### StateComponents

- `LoadingSpinner`: Loading indicator
- `ErrorMessage`: Error state display
- `EmptyState`: No data state display

### PhoneHistoryTableBody

Custom table body component that handles row expansion to show detailed call information.

## Hooks

### usePhoneHistoryColumns

Custom hook that defines the table columns with proper cell renderers and memoization.

## Usage

```tsx
import { PhoneHistoryModal } from "@/app/[locale]/(dashboard)/call-reporting/phone-history";

// In your component
<PhoneHistoryModal
  open={isOpen}
  onOpenChange={setIsOpen}
  phoneNumber={selectedPhoneNumber}
/>;
```

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the application
3. **Maintainability**: Easier to locate and modify specific functionality
4. **Type Safety**: Centralized type definitions
5. **Clean Imports**: Barrel exports for cleaner import statements
6. **Separation of Concerns**: Logic, UI, and types are properly separated
