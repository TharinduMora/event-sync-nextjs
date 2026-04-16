import { VideoItem } from "./types";
import { sheetSelection } from "./sheetSelection";

const API_BASE_URL = "/api";

export const videoApi = {
  // Fetch all videos from the sheet data API
  fetchVideos: async (): Promise<VideoItem[]> => {
    try {
      const selectedSheet = sheetSelection.getSelectedSheet();
      if (!selectedSheet) {
        throw new Error("No sheet selected. Please select a sheet from the Sheets tab.");
      }

      const url = new URL(`${window.location.origin}${API_BASE_URL}/sheet-data`);
      url.searchParams.append("sheetId", selectedSheet.google_sheet_id);

      const response = await fetch(url.toString(), {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.statusText}`);
      }

      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  },

  // Submit a new video entry
  submitVideo: async (videoData: {
    link: string;
    tags: string;
    timeDuration: string;
    thumbnail?: string;
  }): Promise<void> => {
    try {
      const selectedSheet = sheetSelection.getSelectedSheet();
      if (!selectedSheet) {
        throw new Error("No sheet selected. Please select a sheet from the Sheets tab.");
      }

      const url = new URL(`${window.location.origin}${API_BASE_URL}/sheet-data`);
      url.searchParams.append("sheetId", selectedSheet.google_sheet_id);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit video: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error submitting video:", error);
      throw error;
    }
  },

  // Update an existing video entry
  updateVideo: async (videoData: {
    id: number;
    link: string;
    tags: string;
    timeDuration: string;
    thumbnail?: string;
  }): Promise<void> => {
    try {
      const selectedSheet = sheetSelection.getSelectedSheet();
      if (!selectedSheet) {
        throw new Error("No sheet selected. Please select a sheet from the Sheets tab.");
      }

      const url = new URL(`${window.location.origin}${API_BASE_URL}/sheet-data`);
      url.searchParams.append("sheetId", selectedSheet.google_sheet_id);

      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update video: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating video:", error);
      throw error;
    }
  },
};
