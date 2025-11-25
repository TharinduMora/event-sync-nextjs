"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import PasswordProtection from "../../components/PasswordProtection";
import { VideoItem } from "../../utils/types";
import { videoStorage } from "../../utils/videoStorage";

export default function ViewPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<VideoItem | null>(null);

  useEffect(() => {
    const videoId = Number(params.id);
    
    // Try to get video from localStorage using utility
    const found = videoStorage.getVideoById(videoId);
    
    if (!found) {
      if (!videoStorage.hasVideoList()) {
        alert("No data found in localStorage. Go back to the list page first.");
      } else {
        alert("Item not found.");
      }
      router.push("/video-organizer/list");
      return;
    }

    setItem(found);
  }, [params.id, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const getTags = (tagsString: string) => {
    return tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  };

  const handleTagClick = (tag: string) => {
    // Navigate to list page with the tag as a query parameter
    router.push(`/video-organizer/list?tag=${encodeURIComponent(tag)}`);
  };

  if (!item) return <p className={styles.loading}>Loading...</p>;

  const tags = getTags(item.tags);

  return (
    <PasswordProtection>
    <main className={styles.container}>
      <div className={styles.videoWrapper}>
        <iframe
          src={item.link}
          allowFullScreen
          title="Video"
          className={styles.videoFrame}
        ></iframe>
      </div>

      <div className={styles.details}>
        <h1 className={styles.title}>Video Details</h1>

        <div className={styles.infoSection}>
          <label className={styles.label}>Added Date:</label>
          <p className={styles.value}>{formatDate(item.date)}</p>
        </div>

        <div className={styles.infoSection}>
          <label className={styles.label}>Duration:</label>
          <p className={styles.value}>{item.timeDuration}</p>
        </div>

        <div className={styles.infoSection}>
          <label className={styles.label}>Tags:</label>
          <div className={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleTagClick(tag)}
                className={styles.tag}
                title={`View videos with tag: ${tag}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push("/video-organizer/list")}
          className={styles.backBtn}
        >
          ← Back to List
        </button>
      </div>
    </main>
    </PasswordProtection>
  );
}
