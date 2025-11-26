"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { clearVideoOrganizerAuth } from "./PasswordProtection";
import { videoApi } from "../utils/videoApi";
import { videoStorage } from "../utils/videoStorage";
import { useToast } from "./ToastProvider";

export default function VideoOrganizerNavbar() {
  const pathname = usePathname();
  const [isFetching, setIsFetching] = useState(false);
  const { showToast } = useToast();

  const handleHomeClick = () => {
    clearVideoOrganizerAuth();
  };

  const handleFetchVideos = async () => {
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
          <button
            onClick={handleFetchVideos}
            disabled={isFetching}
            className={styles.fetchBtn}
          >
            {isFetching ? "Fetching..." : "🔄 Fetch Videos"}
          </button>
        </div>
      </div>
    </nav>
  );
}
