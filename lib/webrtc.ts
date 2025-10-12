import { defaultCountry, webrtcCountries } from "@/constants/countries";
import { AgentActivity } from "@/types/webrtc";

export const replaceDialCode = (number: string): string => {
  const country = webrtcCountries.find((c) => number.startsWith(c.code));
  if (country) {
    return number.replace(country.code, country.dialCode);
  }
  return number;
};

/**
 * Smart country detection based on phone number input
 * Works for both partial and full numbers:
 * - Partial: "+2" finds "+20" (first country starting with +2)
 * - Full: "+201097722" finds "+20" (Egypt - number starts with +20)
 * - International: "00201097722" finds "+20" (Egypt via international prefix)
 */
export const detectCountryFromNumber = (input: string): string => {
  if (!input) return defaultCountry.code;

  // Don't search if input is just "+"
  if (input === "+") return defaultCountry.code;

  // Normalize input by removing + prefix for comparison
  const normalizedInput = input.startsWith("+") ? input.slice(1) : input;

  // Don't search if normalized input is empty (was just "+")
  if (!normalizedInput) return defaultCountry.code;

  // Handle international prefix format first (e.g., "00201097722" -> "201097722")
  let searchInput = normalizedInput;
  if (normalizedInput.startsWith("00")) {
    searchInput = normalizedInput.slice(2); // Remove "00"
  }

  // Sort countries by dial code length (longest first) to prioritize more specific matches
  const sortedCountries = [...webrtcCountries].sort(
    (a, b) => b.dialCode.length - a.dialCode.length
  );

  // Search through countries and return first match
  for (const country of sortedCountries) {
    const countryCode = country.dialCode.replace("+", "");

    // Case 1: Input number starts with this country's dial code (for full/partial numbers)
    // e.g., "201097722" starts with "20" -> matches "+20"
    if (searchInput.startsWith(countryCode)) {
      return country.code;
    }

    // Case 2: Country dial code starts with the input (for partial search)
    // e.g., input "2" matches "+20", "+212", "+213", etc. - returns first found
    if (countryCode.startsWith(searchInput)) {
      return country.code;
    }
  }

  return defaultCountry.code; // No country found
};

/**
 * Validates if an agent can transition from one activity to another
 * @param from - Current agent activity (null if no previous activity)
 * @param to - Target activity to transition to
 * @returns true if transition is allowed, false otherwise
 */
export const isValidTransition = (
  from: AgentActivity | null,
  to: AgentActivity
): boolean => {
  // First time activity
  if (!from) {
    return [
      AgentActivity.BREAK_STARTED,
      AgentActivity.READY_ACCEPT_CALL,
      AgentActivity.PORTAL_LOGGED_OUT,
      AgentActivity.DIALPAD_LOGGED_OUT,
    ].includes(to);
  }

  // Prevent duplicate consecutive activities (e.g., BREAK_STARTED -> BREAK_STARTED)
  if (from === to) {
    return false;
  }

  if (
    from == AgentActivity.PORTAL_LOGGED_OUT ||
    from == AgentActivity.DIALPAD_LOGGED_OUT
  ) {
    return [AgentActivity.READY_ACCEPT_CALL].includes(to);
  }

  // Agent on break can only: end break, logout from portal, or logout from dialpad
  if (from === AgentActivity.BREAK_STARTED) {
    return [
      AgentActivity.BREAK_ENDED,
      AgentActivity.PORTAL_LOGGED_OUT,
      AgentActivity.DIALPAD_LOGGED_OUT,
    ].includes(to);
  }

  // After break ends, agent can: logout from portal/dialpad or become ready for calls
  if (from === AgentActivity.BREAK_ENDED) {
    return [
      AgentActivity.PORTAL_LOGGED_OUT,
      AgentActivity.DIALPAD_LOGGED_OUT,
      AgentActivity.BREAK_STARTED,
    ].includes(to);
  }

  // Ready agent can: logout from portal/dialpad or go on break
  if (from === AgentActivity.READY_ACCEPT_CALL) {
    return [
      AgentActivity.PORTAL_LOGGED_OUT,
      AgentActivity.DIALPAD_LOGGED_OUT,
      AgentActivity.BREAK_STARTED,
    ].includes(to);
  }

  // Connected but not ready agent can:  become ready for calls
  if (from === AgentActivity.CONNECTED_NOT_READY) {
    return [
      AgentActivity.READY_ACCEPT_CALL,
      AgentActivity.PORTAL_LOGGED_OUT,
    ].includes(to);
  }

  // For all other activity types, allow any transition (fallback rule)
  return true;
};

export const forcePCMA = (sdp: string) => {
  const lines = sdp.split("\r\n");

  // Keep only PCMA in the m=audio line
  const mAudioIndex = lines.findIndex((l) => l.startsWith("m=audio"));
  if (mAudioIndex !== -1) {
    lines[mAudioIndex] = lines[mAudioIndex].replace(
      /(m=audio \d+ [A-Z\/]+).*/,
      "$1 8"
    );
  }

  // Filter rtpmap: keep only PCMA
  const filtered = lines.filter(
    (line) => !line.startsWith("a=rtpmap:") || line.includes("PCMA/8000")
  );

  return filtered.join("\r\n");
};
