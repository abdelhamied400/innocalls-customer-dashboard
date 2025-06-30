export type ExtensionStatus = "enabled" | "disabled";
export type Extension = {
  email: string;
  ext: string;
  id: string;
  name: string;
  status: ExtensionStatus;
};

export type WithCredentials<T> = T & {
  uri: string;
  password: string;
};

export type ExtensionWithCredentials = WithCredentials<Extension>;
