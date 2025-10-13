import { detectCountryFromNumber } from "@/lib/webrtc";
import { webrtcCountries } from "@/constants/countries";

export interface DialpadProcessResult {
  processedNumber: string;
  detectedDialCode: string;
}

/**
 * Processes a phone number input and handles:
 * - Sanitization (only allowing +, digits, #, *)
 * - Auto-adding "+" for country codes
 * - Country detection
 */
export const processPhoneNumber = (
  input: string,
  userSelectedCountry: boolean = false
): DialpadProcessResult => {
  let processedNumber = input;

  // Allow only leading +, then digits, #, *
  if (processedNumber.startsWith("+")) {
    processedNumber = "+" + processedNumber.slice(1).replace(/[^\d#*]/g, "");
  } else {
    processedNumber = processedNumber.replace(/[^\d#*]/g, "");
  }

  // Check if user typed a country code and auto-add "+" if needed
  // Only add "+" if the number has at least 5 digits
  if (!processedNumber.startsWith("+") && processedNumber.length >= 5) {
    // Get all country dial codes without the "+" prefix
    const countryDialCodes = webrtcCountries.map((c) => c.dialCode.slice(1));

    // Check if the input starts with any country code
    const matchingCountryCode = countryDialCodes.find((code) =>
      processedNumber.startsWith(code)
    );

    if (matchingCountryCode) {
      processedNumber = "+" + processedNumber;
    }
  }

  // Auto-detect country only if user didn't pick one manually
  let detectedDialCode = "";
  if (!userSelectedCountry) {
    detectedDialCode = detectCountryFromNumber(processedNumber);
  }

  return {
    processedNumber,
    detectedDialCode,
  };
};

/**
 * Handles backspace functionality for phone numbers
 */
export const handleBackspace = (currentNumber: string): string => {
  return currentNumber.slice(0, -1);
};

/**
 * Handles long backspace (clear all) functionality
 */
export const handleClearAll = (): string => {
  return "";
};

/**
 * Handles adding a digit to the current number
 */
export const handleAddDigit = (
  currentNumber: string,
  digit: string,
  userSelectedCountry: boolean = false
): DialpadProcessResult => {
  let newNumber = currentNumber;

  if (digit === "+") {
    newNumber = currentNumber.length === 0 ? "+" : currentNumber;
  } else if (/^[0-9#*]$/.test(digit)) {
    newNumber = currentNumber + digit;
  }

  return processPhoneNumber(newNumber, userSelectedCountry);
};
