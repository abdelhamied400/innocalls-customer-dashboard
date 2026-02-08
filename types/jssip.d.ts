declare module "jssip" {
  export { UA } from "jssip/lib/UA";
  export { WebSocketInterface } from "jssip/lib/WebSocketInterface";
  export { URI } from "jssip/lib/URI";
  export { NameAddrHeader } from "jssip/lib/NameAddrHeader";
  export { Grammar } from "jssip/lib/Grammar";
  export { RTCSession } from "jssip/lib/RTCSession";
  export * as C from "jssip/lib/Constants";
  export * as Exceptions from "jssip/lib/Exceptions";
  export * as Utils from "jssip/lib/Utils";
  export const name: string;
  export const version: string;
}

declare module "jssip/src/UA" {
  export * from "jssip/lib/UA";
}
