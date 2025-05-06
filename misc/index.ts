import { CountryLisT } from "@/lib/assets";

export const getCountryCode = (search: string): string | undefined => {
  const country = CountryLisT?.find(
    (country: any) => country.label.toLowerCase() === search.toLowerCase()
  );
  return country?.code;
};
