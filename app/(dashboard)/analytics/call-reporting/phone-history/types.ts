export interface PhoneHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
}

export interface PhoneHistoryTableBodyProps {
  data: import("@/types/api/call-reporting").PhoneHistoryItem[];
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  columns: import("@tanstack/react-table").ColumnDef<
    import("@/types/api/call-reporting").PhoneHistoryItem
  >[];
}

export interface DirectionBadgeProps {
  direction: string;
}

export interface CallAnsweredBadgeProps {
  answered: boolean;
}

export interface DateTimeProps {
  date: string;
  time: string;
}

export interface ExtCellProps {
  ext: string;
  name: string;
}

export interface RecordingCellProps {
  callId: string;
}

export interface ErrorMessageProps {
  message: string;
}

export type BadgeVariant =
  | "default"
  | "muted"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "outline"
  | "gray";
