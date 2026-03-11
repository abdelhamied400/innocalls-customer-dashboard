export type WebCallApp = {
  id: string;
  domains?: string[];
  callerId?: string;
  iconText?: string;
  iconBackgroundColor?: string;
  iconBaseColor?: string;
  iconFontColor?: string;
  destinationNumber?: string;
  concurrentCalls?: number;
  serviceEnabled: boolean;
};

export type CreateWebCallAppPayload = {
  iconText: string;
  iconBackgroundColor: string;
  iconBaseColor: string;
  iconFontColor: string;
  concurrentCalls: number;
  destinationNumber: string;
  callerId: string;
  domains: string[];
};

export type UpdateWebCallAppPayload = CreateWebCallAppPayload;

export type CreateWebCallAppResponse = {
  id: string;
};
