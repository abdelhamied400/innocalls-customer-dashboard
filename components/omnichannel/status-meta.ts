import {
  Bolt,
  DoDisturbOn,
  Inbox,
  Schedule,
  TaskAlt,
  type SvgIconComponent,
} from "@mui/icons-material";

/**
 * Shared icon + tone metadata for conversation statuses. Used by:
 *   - ConversationList's segmented status filter
 *   - ConversationItem's status badge in the inbox row
 *   - ChatHeader's status badge above the active chat
 *
 * Keep this in lockstep so the inbox reads as one coherent palette.
 * Tone classes match the Badge variants on the inbox row.
 */
export type StatusKey = "all" | "active" | "waiting" | "resolved" | "closed";

export const STATUS_META: Record<
  StatusKey,
  {
    icon: SvgIconComponent;
    /** Saturated tone applied to the icon when the row's status matches /
     * the filter tab is active. */
    activeTone: string;
    /** Slightly washed-out tone used on the inactive filter tab so the
     * row still reads as a coherent palette without screaming. */
    inactiveTone: string;
  }
> = {
  all: {
    icon: Inbox,
    activeTone: "!text-primary-500",
    inactiveTone: "!text-gray-400",
  },
  active: {
    icon: Bolt,
    activeTone: "!text-emerald-500",
    inactiveTone: "!text-emerald-400/70",
  },
  waiting: {
    icon: Schedule,
    activeTone: "!text-amber-500",
    inactiveTone: "!text-amber-400/70",
  },
  resolved: {
    icon: TaskAlt,
    activeTone: "!text-sky-500",
    inactiveTone: "!text-sky-400/70",
  },
  closed: {
    icon: DoDisturbOn,
    activeTone: "!text-gray-500",
    inactiveTone: "!text-gray-400/70",
  },
};
