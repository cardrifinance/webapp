export type Status =
  | "pending"
  | "reviewed"
  | "approved"
  | "rejected"
  | "accepted";

export function numberWithCommas(x: any) {
  if (isNaN(parseFloat(x)) || !isFinite(x)) {
    return "0.00";
  }

  return parseFloat(x).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// GET UID
export const getBrowserUID = (): string => {
  const STORAGE_KEY = "browser_uid";

  // Check if we already have a UID in localStorage
  const storedUid = localStorage.getItem(STORAGE_KEY);

  if (storedUid) {
    return storedUid;
  }

  // Generate a new UUID
  const newUid = (() => {
    // Try crypto.randomUUID() first if available
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback UUID v4 generator
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  })();

  // Store for future visits
  localStorage.setItem(STORAGE_KEY, newUid);

  return newUid;
};

export const getStatusText = (status: Status | string) => {
  const firstChar = status?.charAt(0)?.toUpperCase();
  const rest = status?.slice(1).toLowerCase();
  return `${firstChar}${rest}`;
};
