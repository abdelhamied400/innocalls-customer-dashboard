export type ApiCredential = {
  id: string;
  title: string;
  apiId: string;
  isDeleted: boolean;
  isActive: boolean;
  services: string[];
  lastUsage: string | null;
};

export type CreateApiCredentialResponse = {
  apiId: string;
  apiSecret: string;
};
