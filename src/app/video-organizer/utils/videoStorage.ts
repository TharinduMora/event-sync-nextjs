import { VideoItem } from "./types";

const VIDEO_LIST_KEY = "videoList";

export const videoStorage = {
  // Save video list to localStorage
  saveVideoList: (videos: VideoItem[]): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(VIDEO_LIST_KEY, JSON.stringify(videos));
    }
  },

  // Get video list from localStorage
  getVideoList: (): VideoItem[] | null => {
    if (typeof window !== "undefined") {
      const listStr = localStorage.getItem(VIDEO_LIST_KEY);
      if (listStr) {
        try {
          return JSON.parse(listStr) as VideoItem[];
        } catch (error) {
          console.error("Error parsing video list from localStorage:", error);
          return null;
        }
      }
    }
    return null;
  },

  // Get a single video by ID
  getVideoById: (id: number): VideoItem | null => {
    const list = videoStorage.getVideoList();
    if (!list) return null;
    return list.find((video) => video.id === id) || null;
  },

  // Clear video list from localStorage
  clearVideoList: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(VIDEO_LIST_KEY);
    }
  },

  // Check if video list exists in localStorage
  hasVideoList: (): boolean => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(VIDEO_LIST_KEY) !== null;
    }
    return false;
  },
};
