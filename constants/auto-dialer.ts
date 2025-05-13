export type AutoDialerCampaignActiveStatus =
  | "schedule-customers"
  | "customers-inserted"
  | "verifying-customers"
  | "verification-failed"
  | "created"
  | "started"
  | "in-progress"
  | "active"
  | "paused"
  | "corrupted-ignored";
export type AutoDialerCampaignInactiveStatus =
  | "completed"
  | "cancelled"
  | "failed"
  | "finished";
export type AutoDialerCampaignStatus =
  | AutoDialerCampaignActiveStatus
  | AutoDialerCampaignInactiveStatus;

export const autoDialerCampaignActiveStatuses = [
  { value: "schedule-customers", label: "schedule-customers" },
  { value: "customers-inserted", label: "customers-inserted" },
  { value: "verifying-customers", label: "verifying-customers" },
  { value: "verification-failed", label: "verification-failed" },
  { value: "created", label: "created" },
  { value: "started", label: "started" },
  { value: "in-progress", label: "in-progress" },
  { value: "active", label: "active" },
  { value: "paused", label: "paused" },
  { value: "corrupted-ignored", label: "corrupted-ignored" },
];

export const autoDialerCampaignInactiveStatuses = [
  { value: "completed", label: "completed" },
  { value: "cancelled", label: "cancelled" },
  { value: "failed", label: "failed" },
  { value: "finished", label: "finished" },
];

export const autoDialerCampaignStatuses = [
  ...autoDialerCampaignActiveStatuses,
  ...autoDialerCampaignInactiveStatuses,
];
