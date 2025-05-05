import { format, toZonedTime } from "date-fns-tz";

// A static list of IANA timezones — you can pull this from moment-timezone.tz.names() if needed
import timeZoneNames from "./timezones-list"; // an array of IANA names, e.g., ['America/New_York', 'Europe/London']

export type Timezone = {
  name: string;
  id: string;
};

export const timezones = timeZoneNames.map((tz) => {
  const now = new Date();
  const zonedDate = toZonedTime(now, tz);
  const offsetMinutes = zonedDate.getTimezoneOffset() * -1;
  const offsetHours = offsetMinutes / 60;
  const formattedOffset = `(GMT${offsetHours >= 0 ? "+" : ""}${offsetHours
    .toFixed(2)
    .replace(".00", "")})`;

  return {
    name: `${tz} ${formattedOffset}`,
    id: tz,
  };
});
