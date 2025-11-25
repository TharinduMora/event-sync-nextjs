"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import VideoOrganizerNavbar from "../components/navbar";
import PasswordProtection from "../components/PasswordProtection";
import { VideoItem } from "../utils/types";
import { videoStorage } from "../utils/videoStorage";
import { videoApi } from "../utils/videoApi";

const ITEMS_PER_PAGE = 3;

function ListPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<VideoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        // Use API service to fetch videos
        const videos = await videoApi.fetchVideos();
        setData(videos);

        // Save to localStorage using utility
        videoStorage.saveVideoList(videos);
      } catch (error) {
        console.error("Error loading videos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Set search query from URL parameter
  useEffect(() => {
    const tagParam = searchParams.get("tag");
    if (tagParam) {
      setSearchQuery(tagParam);
    }
  }, [searchParams]);

  // Filter videos by search query (tags)
  const filteredVideos = data.filter((item) => {
    if (!searchQuery.trim()) return true;
    return item.tags.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleVideos = filteredVideos.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchQuery(tag.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    // Clear query parameters from URL
    router.push("/video-organizer/list");
  };

  const getTags = (tagsString: string) => {
    return tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={styles.pageBtn}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className={styles.ellipsis}>
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.pageBtn} ${i === currentPage ? styles.activePage : ""
            }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className={styles.ellipsis}>
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={styles.pageBtn}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  const renderPagination = () => (
    <div className={styles.paginationContainer}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.navBtn}
      >
        Previous
      </button>

      <div className={styles.pageNumbers}>{renderPageNumbers()}</div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.navBtn}
      >
        Next
      </button>
    </div>
  );

  return (
    <PasswordProtection>
      <VideoOrganizerNavbar />
      <main className={styles.container}>
        <h1>Video Library</h1>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className={styles.clearBtn}
            >
              Clear
            </button>
          )}
        </div>

        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
            <p className={styles.loadingText}>Loading videos...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <p className={styles.noResults}>
            No videos found matching your search.
          </p>
        ) : (
          <>
            {totalPages > 1 && renderPagination()}

            <div className={styles.grid}>
              {visibleVideos.map((item) => {
                const tags = getTags(item.tags);
                return (
                  <div key={item.id} className={styles.tileWrapper}>
                    <Link
                      href={`/video-organizer/view/${item.id}`}
                      className={styles.tile}
                    >
                      <div className={styles.thumbnail}>
                        {/* <iframe
                          src={item.link}
                          title={item.tags}
                          allowFullScreen
                        ></iframe> */}
                      </div>
                      <div className={styles.info}>
                        <p className={styles.duration}>{item.timeDuration}</p>
                      </div>
                    </Link>
                    <div className={styles.tagsWrapper}>
                      <button
                        onClick={() => window.open(item.link, "_blank", "noopener,noreferrer")}
                        className={styles.openLinkBtn}
                        type="button"
                      >
                        Open
                      </button>
                      {tags.map((tag, index) => (
                        <button
                          key={index}
                          onClick={(e) => handleTagClick(tag, e)}
                          className={styles.tagBtn}
                          title={`Filter by: ${tag}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && renderPagination()}
          </>
        )}
      </main>
    </PasswordProtection>
  );
}

export default function ListPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#1a202c',
        color: '#e2e8f0'
      }}>
        <div>Loading...</div>
      </div>
    }>
      <ListPageContent />
    </Suspense>
  );
}
