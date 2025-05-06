import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { baseURL } from "./axiosInstance";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const serverRoute = (route: string): string => `${baseURL}${route}`;

export const tokenExtractor = (): {
  authHeader: string;
  tokenData: any;
} | null => {
  const token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const token_type = localStorage.getItem("token_type");

  if (!token || !token_type) return null;

  try {
    const parsedToken = JSON.parse(token) as string;
    const parsedRefresh_token = JSON.parse(refresh_token as string) as string;
    const parsedTokenType = JSON.parse(token_type) as string;

    const tokenData = {
      token_type: parsedTokenType,
      access_token: parsedToken,
      refresh_token: parsedRefresh_token,
    };

    return {
      authHeader: `Bearer ${parsedToken}`,
      tokenData,
    };
  } catch (error) {
    console.error("Failed to parse token from local storage", error);
    return null;
  }
};
