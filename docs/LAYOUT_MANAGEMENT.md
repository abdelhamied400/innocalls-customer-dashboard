# Layout Management System

This document describes the improved layout management system for the dashboard that replaces the previous if-else statement approach with a more maintainable and scalable solution.

## Overview

The new layout system provides:

- **Clean separation of concerns** - Layout logic is separated from component logic
- **Type safety** - Full TypeScript support with proper typing
- **Reusability** - Layout logic can be reused across components
- **Testability** - Layout logic can be easily unit tested
- **Extensibility** - Easy to add new layout states and configurations

## Architecture

### Core Components

1. **`useLayoutManager` Hook** (`/hooks/use-layout-manager.ts`)

   - Manages layout state and configuration
   - Returns layout classes and utility functions
   - Provides layout variant information

2. **Layout Configuration** (`/lib/layout-config.ts`)

   - Advanced configuration with responsive and animation support
   - Layout predicates for conditional rendering
   - Transition and animation utilities

3. **Layout Provider** (`/providers/LayoutProvider.tsx`)
   - Context provider for layout state management
   - Additional utilities and actions
   - Global layout state access

## Usage Examples

### Basic Usage (Current Implementation)

```tsx
import { useLayoutManager } from "@/hooks/use-layout-manager";

const DashboardLayout = () => {
  const { isSidebarOpen, isWebrtcOpen } = useAppStore();

  const {
    getLayoutClasses,
    layoutVariant,
    isCompact,
    hasExpandedSidebar,
    hasExpandedWebrtc,
  } = useLayoutManager({
    isSidebarOpen,
    isWebrtcOpen,
  });

  return (
    <div className={getLayoutClasses.container}>
      <div className={getLayoutClasses.sidebar}>
        <AppSidebar />
      </div>
      <div className={getLayoutClasses.navbar}>
        <AppNavbar />
      </div>
      <div className={getLayoutClasses.mainContent}>{children}</div>
      {hasWebrtcAccess && (
        <div className={getLayoutClasses.webrtc}>
          <Innortc />
        </div>
      )}
    </div>
  );
};
```

### Advanced Usage with Context Provider

```tsx
import { LayoutProvider, useLayout } from "@/providers/LayoutProvider";

// Wrap your app with LayoutProvider
function App() {
  return (
    <LayoutProvider>
      <DashboardLayout />
    </LayoutProvider>
  );
}

// Use layout context in any component
function SomeComponent() {
  const { layoutVariant, predicates, toggleSidebar, toggleWebrtc } =
    useLayout();

  const isCompactMode = predicates.isCompactMode(layoutVariant);
  const hasExpandedSidebar = predicates.hasSidebarExpanded(layoutVariant);

  return (
    <div>
      {isCompactMode && <CompactModeIndicator />}
      <button onClick={toggleSidebar}>
        {hasExpandedSidebar ? "Hide" : "Show"} Sidebar
      </button>
    </div>
  );
}
```

### Responsive Layout Configuration

```tsx
import { getLayoutConfigForBreakpoint } from "@/lib/layout-config";

function ResponsiveLayout() {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const { layoutVariant } = useLayoutManager({ isSidebarOpen, isWebrtcOpen });

  const config = getLayoutConfigForBreakpoint(layoutVariant, breakpoint);

  return <div className={config.gridCols}>{/* Layout content */}</div>;
}
```

## Layout Variants

The system supports four main layout variants:

1. **`both_open`** - Both sidebar and WebRTC panel are open
2. **`sidebar_only`** - Only sidebar is open, WebRTC panel is collapsed
3. **`webrtc_only`** - Only WebRTC panel is open, sidebar is collapsed
4. **`both_closed`** - Both panels are collapsed

## Layout Predicates

Utility functions for conditional rendering based on layout state:

```tsx
import { layoutPredicates } from "@/lib/layout-config";

const isCompact = layoutPredicates.isCompactMode(layoutVariant);
const hasSidebar = layoutPredicates.hasSidebarExpanded(layoutVariant);
const hasWebrtc = layoutPredicates.hasWebrtcExpanded(layoutVariant);
const isFullWidth = layoutPredicates.isFullWidth(layoutVariant);
```

## Benefits Over Previous Implementation

### Before (If-Else Statements)

```tsx
const getLayoutClassName = () => {
  const bothOpen = "grid-cols-[360px_1fr_280px]";
  const sidebarOpen = "grid-cols-[360px_1fr_80px]";
  const webrtcOpen = "grid-cols-[0px_1fr_280px]";
  const bothClosed = "grid-cols-[0px_1fr_80px]";

  if (isSidebarOpen && isWebrtcOpen) {
    return bothOpen;
  } else if (isSidebarOpen) {
    return sidebarOpen;
  } else if (isWebrtcOpen) {
    return webrtcOpen;
  } else {
    return bothClosed;
  }
};
```

### After (New System)

```tsx
const { getLayoutClasses, layoutVariant } = useLayoutManager({
  isSidebarOpen,
  isWebrtcOpen
});

// Clean, readable, and extensible
return <div className={getLayoutClasses.container}>
```

### Key Improvements

1. **Maintainability** - Layout logic is centralized and easier to modify
2. **Testability** - Can easily unit test layout logic in isolation
3. **Type Safety** - Full TypeScript support prevents errors
4. **Reusability** - Layout logic can be shared across components
5. **Extensibility** - Easy to add new layout states without modifying existing code
6. **Performance** - Memoized calculations prevent unnecessary re-renders

## Testing

The layout system can be easily tested:

```tsx
import { renderHook } from "@testing-library/react";
import { useLayoutManager } from "@/hooks/use-layout-manager";

describe("useLayoutManager", () => {
  it("should return correct layout for both_open variant", () => {
    const { result } = renderHook(() =>
      useLayoutManager({ isSidebarOpen: true, isWebrtcOpen: true })
    );

    expect(result.current.layoutVariant).toBe("both_open");
    expect(result.current.config.gridCols).toBe("grid-cols-[360px_1fr_280px]");
  });
});
```

## Future Enhancements

The new system makes it easy to add:

- Responsive breakpoint support
- Animation configurations
- Theme-based layout variations
- Layout persistence
- Layout analytics and tracking
- A/B testing for different layouts
