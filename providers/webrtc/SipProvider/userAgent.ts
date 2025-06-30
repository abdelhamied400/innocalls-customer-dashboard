import JsSIP from "jssip";
import CryptoJS from "crypto-js";

const SIP_INTERFACE = process.env.NEXT_PUBLIC_SIP_INTERFACE!;
const DECRYPT_SECRET = process.env.NEXT_PUBLIC_DECRYPT_SECRET!;

export const createUserAgent = (uri: string, password: string) => {
  process.env.NODE_ENV === "production"
    ? JsSIP.debug.disable()
    : JsSIP.debug.enable("JsSIP:*");
  const socket = new JsSIP.WebSocketInterface(SIP_INTERFACE);

  // decrypt password
  const passwordBytes = CryptoJS.AES.decrypt(password, DECRYPT_SECRET);
  const decryptedPassword = passwordBytes.toString(CryptoJS.enc.Utf8);

  const ua = new JsSIP.UA({
    sockets: [socket],
    uri,
    password: decryptedPassword,
    user_agent: "platform-webrtc",
  });

  ua.start();

  return ua;
};
