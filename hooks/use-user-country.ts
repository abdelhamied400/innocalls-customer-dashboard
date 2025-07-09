// hooks/useUserCountry.ts
import { useEffect, useState } from "react";

export function useUserCountry() {
  const [loading, setLoading] = useState(true);
  const [countryCode, setCountryCode] = useState<string | undefined>();

  useEffect(() => {
    async function fetchCountry() {
      try {
        setLoading(true);
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data && data.country_code) {
          setCountryCode(data.country_code);
        }
      } catch (error) {
        console.error("Failed to fetch country:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCountry();
  }, []);

  return { countryCode, loading };
}
