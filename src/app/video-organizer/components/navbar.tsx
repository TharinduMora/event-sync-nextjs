"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { clearVideoOrganizerAuth } from "./PasswordProtection";

export default function VideoOrganizerNavbar() {
  const pathname = usePathname();

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
        </div>
      </div>
    </nav>
  );
}
