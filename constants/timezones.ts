import { formatInTimeZone } from "date-fns-tz";

// A static list of IANA timezones — you can pull this from moment-timezone.tz.names() if needed
import timeZoneNames from "./timezones-list"; // an array of IANA names, e.g., ['America/New_York', 'Europe/London']

export type Timezone = {
  name: string;
  id: string;
};

export const timezones = timeZoneNames.map((tz) => {
  const now = new Date();
  // formatInTimeZone with "xxx" gives the correct offset for the target tz, e.g. "+02:00"
  const offsetStr = formatInTimeZone(now, tz, "xxx");
  const formattedOffset = `(GMT${offsetStr})`;

  return {
    name: `${tz} ${formattedOffset}`,
    id: tz,
  };
});
