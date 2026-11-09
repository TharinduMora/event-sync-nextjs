"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import VideoOrganizerNavbar from "../components/navbar";
import PasswordProtection from "../components/PasswordProtection";
import { videoStorage } from "../utils/videoStorage";

interface CategoryTile {
  tag: string;
  image?: string;
}

function CategoriesPageContent() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryTile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = () => {
      try {
        const videos = videoStorage.getVideoList() || [];
        const uniqueTags = new Set<string>();
        const firstImageByTag = new Map<string, string | undefined>();

        videos.forEach((video) => {
          const tags = video.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

          tags.forEach((tag) => {
            if (!uniqueTags.has(tag)) {
              uniqueTags.add(tag);
              firstImageByTag.set(tag, video.thumbnail || undefined);
            }
          });
        });

        const sortedTags = Array.from(uniqueTags).sort((a, b) => a.localeCompare(b));
        const categoryTiles = sortedTags.map((tag) => ({
          tag,
          image: firstImageByTag.get(tag),
        }));

        setCategories(categoryTiles);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
    const unsubscribe = videoStorage.subscribeToVideoDataUpdates(loadCategories);
    return () => unsubscribe();
  }, []);

  const handleCategoryClick = (tag: string) => {
    router.push(`/video-organizer/list?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <PasswordProtection>
      <VideoOrganizerNavbar />
      <main className={styles.container}>
        <h1>Categories</h1>

        {isLoading ? (
          <div className={styles.loading}>Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className={styles.emptyState}>No tags available.</div>
        ) : (
          <div className={styles.grid}>
            {categories.map((category) => (
              <button
                key={category.tag}
                type="button"
                className={styles.tile}
                onClick={() => handleCategoryClick(category.tag)}
                title={`View videos for ${category.tag}`}
              >
                <div className={styles.imageWrap}>
                  {category.image ? (
                    <img src={category.image} alt={category.tag} className={styles.image} />
                  ) : (
                    <div className={styles.noImage}>No Image</div>
                  )}
                </div>
                <div className={styles.tileTitle}>{category.tag}</div>
              </button>
            ))}
          </div>
        )}
      </main>
    </PasswordProtection>
  );
}

export default function CategoriesPage() {
  return <CategoriesPageContent />;
}
