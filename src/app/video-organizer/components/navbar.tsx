"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { clearVideoOrganizerAuth } from "./PasswordProtection";
import { videoApi } from "../utils/videoApi";
import { videoStorage } from "../utils/videoStorage";
import { useToast } from "./ToastProvider";
import { sheetSelection, SelectedSheet } from "../utils/sheetSelection";

export default function VideoOrganizerNavbar() {
  const pathname = usePathname();
  const [isFetching, setIsFetching] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<SelectedSheet | null>(null);
  const { showToast } = useToast();

  // Load selected sheet on mount
  useEffect(() => {
    const sheet = sheetSelection.getSelectedSheet();
    setSelectedSheet(sheet);
  }, []);

  const handleHomeClick = () => {
    clearVideoOrganizerAuth();
  };

  const handleFetchVideos = async () => {
    if (!selectedSheet) {
      showToast("Please select a sheet from the Sheets tab first", "error");
      return;
    }

    setIsFetching(true);
    try {
      const videos = await videoApi.fetchVideos();
      videoStorage.saveVideoList(videos);
      showToast(`Successfully fetched ${videos.length} videos!`, "success");
      // Reload the page if on list page
      if (pathname === "/video-organizer/list") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      showToast("Failed to fetch videos. Please try again.", "error");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={handleHomeClick}>
          Video Organizer
        </Link>
        <div className={styles.tabs}>
          <Link
            href="/video-organizer"
            className={`${styles.tab} ${
              pathname === "/video-organizer" ? styles.active : ""
            }`}
          >
            Submit
          </Link>
          <Link
            href="/video-organizer/list"
            className={`${styles.tab} ${
              pathname === "/video-organizer/list" ? styles.active : ""
            }`}
          >
            Library
          </Link>
          <Link
            href="/video-organizer/sheet-metadata"
            className={`${styles.tab} ${
              pathname.startsWith("/video-organizer/sheet-metadata") ? styles.active : ""
            }`}
          >
            Sheets
          </Link>
          <div className={styles.selectedSheetInfo}>
            {selectedSheet && (
              <span className={styles.selectedSheetText} title={`Sheet: ${selectedSheet.name}`}>
                📋 {selectedSheet.name}
              </span>
            )}
          </div>
          <button
            onClick={handleFetchVideos}
            disabled={isFetching || !selectedSheet}
            className={styles.fetchBtn}
            title={!selectedSheet ? "Select a sheet first" : "Fetch videos from the selected sheet"}
          >
            {isFetching ? "Fetching..." : "🔄 Fetch Videos"}
          </button>
        </div>
      </div>
    </nav>
  );
}
