import { LayoutVariant } from "@/hooks/use-layout-manager";

export interface AnimationConfig {
  duration: number;
  easing: string;
  stagger?: number;
}

export interface ResponsiveConfig {
  mobile: Partial<LayoutConfig>;
  tablet: Partial<LayoutConfig>;
  desktop: LayoutConfig;
}

export interface LayoutConfig {
  gridCols: string;
  sidebarWidth: number;
  webrtcWidth: number;
  mainAreaCols: string;
  animation?: AnimationConfig;
}

export type LayoutBreakpoint = "mobile" | "tablet" | "desktop";

/**
 * Advanced layout configurations with responsive and animation support
 */
export const ADVANCED_LAYOUT_CONFIGS: Record<LayoutVariant, ResponsiveConfig> =
  {
    "both-open": {
      mobile: {
        gridCols: "grid-cols-1",
        sidebarWidth: 0,
        webrtcWidth: 0,
      },
      tablet: {
        gridCols: "grid-cols-[280px_1fr]",
        sidebarWidth: 280,
        webrtcWidth: 0,
      },
      desktop: {
        gridCols: "grid-cols-[360px_1fr_280px]",
        sidebarWidth: 360,
        webrtcWidth: 280,
        mainAreaCols: "col-span-1",
        animation: {
          duration: 800,
          easing: "ease-in-out",
        },
      },
    },
    "sidebar-only": {
      mobile: {
        gridCols: "grid-cols-1",
        sidebarWidth: 0,
        webrtcWidth: 0,
      },
      tablet: {
        gridCols: "grid-cols-[280px_1fr_80px]",
        sidebarWidth: 280,
        webrtcWidth: 80,
      },
      desktop: {
        gridCols: "grid-cols-[360px_1fr_80px]",
        sidebarWidth: 360,
        webrtcWidth: 80,
        mainAreaCols: "col-span-1",
        animation: {
          duration: 800,
          easing: "ease-in-out",
        },
      },
    },
    "webrtc-only": {
      mobile: {
        gridCols: "grid-cols-1",
        sidebarWidth: 0,
        webrtcWidth: 0,
      },
      tablet: {
        gridCols: "grid-cols-[0px_1fr_280px]",
        sidebarWidth: 0,
        webrtcWidth: 280,
      },
      desktop: {
        gridCols: "grid-cols-[0px_1fr_280px]",
        sidebarWidth: 0,
        webrtcWidth: 280,
        mainAreaCols: "col-span-1",
        animation: {
          duration: 800,
          easing: "ease-in-out",
        },
      },
    },
    "both-closed": {
      mobile: {
        gridCols: "grid-cols-1",
        sidebarWidth: 0,
        webrtcWidth: 0,
      },
      tablet: {
        gridCols: "grid-cols-[0px_1fr_80px]",
        sidebarWidth: 0,
        webrtcWidth: 80,
      },
      desktop: {
        gridCols: "grid-cols-[0px_1fr_80px]",
        sidebarWidth: 0,
        webrtcWidth: 80,
        mainAreaCols: "col-span-1",
        animation: {
          duration: 800,
          easing: "ease-in-out",
        },
      },
    },
  };

/**
 * Utility function to get layout configuration based on breakpoint
 */
export const getLayoutConfigForBreakpoint = (
  variant: LayoutVariant,
  breakpoint: LayoutBreakpoint
): LayoutConfig => {
  const config = ADVANCED_LAYOUT_CONFIGS[variant];

  switch (breakpoint) {
    case "mobile":
      return { ...config.desktop, ...config.mobile };
    case "tablet":
      return { ...config.desktop, ...config.tablet };
    case "desktop":
    default:
      return config.desktop;
  }
};

/**
 * Layout transition classes generator
 */
export const getTransitionClasses = (config: LayoutConfig): string => {
  const { animation } = config;
  if (!animation) return "transition-all duration-300 ease-in-out";

  return `transition-all duration-${animation.duration} ${animation.easing}`;
};

/**
 * Layout state predicates for conditional rendering
 */
export const layoutPredicates = {
  isCompactMode: (variant: LayoutVariant) => variant === "both-closed",
  hasSidebarExpanded: (variant: LayoutVariant) =>
    variant === "both-open" || variant === "sidebar-only",
  hasWebrtcExpanded: (variant: LayoutVariant) =>
    variant === "both-open" || variant === "webrtc-only",
  isFullWidth: (variant: LayoutVariant) =>
    variant === "both-closed" || variant === "webrtc-only",
  isSidebarOnlyMode: (variant: LayoutVariant) => variant === "sidebar-only",
  isWebrtcOnlyMode: (variant: LayoutVariant) => variant === "webrtc-only",
};

export default ADVANCED_LAYOUT_CONFIGS;
