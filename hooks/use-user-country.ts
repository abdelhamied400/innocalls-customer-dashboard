// hooks/useUserCountry.ts
import { useEffect, useState } from "react";

export function useUserCountry() {
  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCountry() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data && data.country_code) {
          setCountryCode(data.country_code);
        }
      } catch (error) {
        console.error("Failed to fetch country:", error);
      }
    }

    fetchCountry();
  }, []);

  return countryCode;
}
