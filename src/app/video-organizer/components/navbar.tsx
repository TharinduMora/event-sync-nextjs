"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { clearVideoOrganizerAuth } from "./PasswordProtection";
import { sheetSelection, SelectedSheet } from "../utils/sheetSelection";

export default function VideoOrganizerNavbar() {
  const pathname = usePathname();
  const [selectedSheet, setSelectedSheet] = useState<SelectedSheet | null>(null);

  // Load selected sheet on mount
  useEffect(() => {
    const sheet = sheetSelection.getSelectedSheet();
    setSelectedSheet(sheet);
  }, []);

  const handleHomeClick = () => {
    clearVideoOrganizerAuth();
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
        </div>
      </div>
    </nav>
  );
}
