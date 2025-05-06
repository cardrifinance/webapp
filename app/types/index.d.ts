// src/global.d.ts or types/global.d.ts
export {}; // Ensure this is a module

declare global {
  interface Window {
    Connect: any; // Use a more specific type if available
    // Also declare DojahWidget if needed
  }
}
