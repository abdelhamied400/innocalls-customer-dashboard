import { setCookie } from "cookies-next/client";

export const getIP = async () => {
  const { ip } = await fetch("/api/get-ip")
    .then((res) => res.json())
    .catch(() => ({}));
  setCookie("ip", ip);
  return ip;
};

export const getTimezone = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone;
};
