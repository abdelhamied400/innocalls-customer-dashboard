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
export type AutoDialerCampaignFinishedStatus =
  | "completed"
  | "cancelled"
  | "failed"
  | "finished";
export type AutoDialerCampaignStatus =
  | AutoDialerCampaignActiveStatus
  | AutoDialerCampaignFinishedStatus;

export const autoDialerCampaignActiveStatuses = [
  { value: "schedule-customers", label: "Schedule customers" },
  { value: "customers-inserted", label: "Customers inserted" },
  { value: "verifying-customers", label: "Verifying customers" },
  { value: "verification-failed", label: "Verification failed" },
  { value: "created", label: "Created" },
  { value: "started", label: "Started" },
  { value: "in-progress", label: "In progress" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "corrupted-ignored", label: "Corrupted ignored" },
];

export const autoDialerCampaignFinishedStatuses = [
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "failed", label: "Failed" },
  { value: "finished", label: "Finished" },
];

export const autoDialerCampaignArchivedStatuses =
  autoDialerCampaignFinishedStatuses;

export const autoDialerCampaignStatuses = [
  ...autoDialerCampaignActiveStatuses,
  ...autoDialerCampaignFinishedStatuses,
];
