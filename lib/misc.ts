import NGN from "@/public/assets/currencies/NGNCurrency.png";
import USD from "@/public/assets/currencies/DollarCurrency.png";
import EUR from "@/public/assets/currencies/EurCurrency.png";
import GBP from "@/public/assets/currencies/PoundsCurrency.png";

export const currencySymbols = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$", // Australia flag + AUD symbol
    CAD: "C$", // Canada flag + CAD symbol
    CHF: "₣", // Switzerland flag + Franc symbol
    CNY: "¥", // China flag + Yuan symbol
    INR: "₹", // India flag + Rupee symbol
    KRW: "₩", // South Korea flag + Won symbol
    MXN: "$", // Mexico flag + Peso symbol
    RUB: "₽", // Russia flag + Ruble symbol
    ZAR: "R", // South Africa flag + Rand symbol
    BRL: "R$", // Brazil flag + Real symbol
    SEK: "kr", // Sweden flag + Krona symbol
    SGD: "S$", // Singapore flag + SGD symbol
  };

  return symbols[currency] || currency;
};

export const currencyImages = (currency: string): string => {
  const imagePaths: { [key: string]: any } = {
    NGN: NGN,
    USD: USD,
    EUR: EUR,
    GBP: GBP,
  };

  return imagePaths[currency] || "/images/currencies/generic.png";
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    // Format as million with 2 decimal places if needed
    const millionValue = num / 1000000;
    return millionValue % 1 === 0
      ? `${millionValue.toFixed(0)}M`
      : `${millionValue.toFixed(2)}M`;
  } else if (num >= 1000) {
    // Add commas for thousands
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return num.toString();
};
