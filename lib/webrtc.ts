import { defaultCountry, webrtcCountries } from "@/constants/countries";

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
