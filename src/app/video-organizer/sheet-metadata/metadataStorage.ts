// Utility for managing sheet metadata in local storage
const METADATA_CACHE_KEY = "sheetMetadataCache";

export interface CachedMetadata {
  data: any[];
  timestamp: number;
}

export const metadataStorage = {
  // Get cached metadata
  getCachedMetadata: (): any[] | null => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem(METADATA_CACHE_KEY);
    return cached ? JSON.parse(cached).data : null;
  },

  // Save metadata to cache
  saveCachedMetadata: (data: any[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      METADATA_CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  },

  // Clear cache
  clearCache: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(METADATA_CACHE_KEY);
  },

  // Get cache timestamp
  getCacheTimestamp: (): number | null => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem(METADATA_CACHE_KEY);
    return cached ? JSON.parse(cached).timestamp : null;
  },
};
