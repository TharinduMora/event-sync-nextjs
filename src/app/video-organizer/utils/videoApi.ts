import { VideoItem } from "./types";

const API_BASE_URL = "/api";

export const videoApi = {
  // Fetch all videos from the sheet data API
  fetchVideos: async (): Promise<VideoItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sheet-data`, {
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
  }): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sheet-data`, {
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
};
