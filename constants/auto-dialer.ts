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
  | "finished";
export type AutoDialerCampaignStatus =
  | AutoDialerCampaignActiveStatus
  | AutoDialerCampaignFinishedStatus;

export const autoDialerCampaignActiveStatuses = (t: any) => [
  {
    value: "schedule-customers",
    label: t("activeCampaigns.statuses.schedule-customers"),
  },
  {
    value: "customers-inserted",
    label: t("activeCampaigns.statuses.customers-inserted"),
  },
  {
    value: "verifying-customers",
    label: t("activeCampaigns.statuses.verifying-customers"),
  },
  {
    value: "verification-failed",
    label: t("activeCampaigns.statuses.verification-failed"),
  },
  { value: "created", label: t("activeCampaigns.statuses.created") },
  { value: "in-progress", label: t("activeCampaigns.statuses.in-progress") },
  { value: "active", label: t("activeCampaigns.statuses.active") },
  { value: "paused", label: t("activeCampaigns.statuses.paused") },
  {
    value: "corrupted-ignored",
    label: t("activeCampaigns.statuses.corrupted-ignored"),
  },
];

export const autoDialerCampaignFinishedStatuses = (t: any) => [
  { value: "completed", label: t("finishedCampaigns.statuses.completed") },
  { value: "cancelled", label: t("finishedCampaigns.statuses.cancelled") },
  { value: "finished", label: t("finishedCampaigns.statuses.finished") },
];

export const autoDialerCampaignArchivedStatuses =
  autoDialerCampaignFinishedStatuses;

export const autoDialerCampaignStatuses = (t: any) => [
  ...autoDialerCampaignActiveStatuses(t),
  ...autoDialerCampaignFinishedStatuses(t),
];
