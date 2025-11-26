"use client";
import { useState, useEffect, FormEvent, KeyboardEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../page.module.css";
import VideoOrganizerNavbar from "../../components/navbar";
import PasswordProtection from "../../components/PasswordProtection";
import { ToastProvider, useToast } from "../../components/ToastProvider";
import { videoApi } from "../../utils/videoApi";
import { videoStorage } from "../../utils/videoStorage";
import { VideoItem } from "../../utils/types";

function EditPageContent() {
  const { showToast } = useToast();
  const params = useParams();
  const router = useRouter();
  const videoId = Number(params.id);
  
  const [link, setLink] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [timeDuration, setTimeDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load video data
    const video = videoStorage.getVideoById(videoId);
    if (!video) {
      showToast("Video not found", "error");
      router.push("/video-organizer/list");
      return;
    }

    setLink(video.link);
    setTimeDuration(video.timeDuration);
    
    // Parse tags
    const videoTags = video.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setTags(videoTags);

    // Load available tags
    const allTags = videoStorage.getAllTags();
    setAvailableTags(allTags);
    
    setIsLoading(false);
  }, [videoId, router, showToast]);

  useEffect(() => {
    // Filter suggestions based on input
    if (tagInput.trim()) {
      const filtered = availableTags.filter(
        (tag) =>
          tag.toLowerCase().includes(tagInput.toLowerCase()) &&
          !tags.includes(tag)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [tagInput, availableTags, tags]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagsString = tags.join(", ");

      // Use API service to update video
      await videoApi.updateVideo({
        id: videoId,
        link,
        tags: tagsString,
        timeDuration,
      });

      showToast("Video updated successfully!", "success");
      
      // Navigate back to view page after short delay
      setTimeout(() => {
        router.push(`/video-organizer/view/${videoId}`);
      }, 1000);
    } catch {
      showToast("Failed to update video. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PasswordProtection>
        <VideoOrganizerNavbar />
        <main className={styles.container}>
          <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>
        </main>
      </PasswordProtection>
    );
  }

  return (
    <PasswordProtection>
      <VideoOrganizerNavbar />
      <main className={styles.container}>
        <h1>Edit Video Entry</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Video Link:</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              type="url"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Tags:</label>
            <div className={styles.tagInputContainer}>
              <div className={styles.inputWrapper}>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() =>
                    tagInput &&
                    setShowSuggestions(filteredSuggestions.length > 0)
                  }
                  type="text"
                  placeholder="Type a tag and press Enter or click Add"
                  className={styles.input}
                />
                {showSuggestions && (
                  <div className={styles.suggestions}>
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={styles.suggestionItem}
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className={styles.addTagBtn}
              >
                Add Tag
              </button>
            </div>

            {tags.length > 0 && (
              <div className={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className={styles.removeTagBtn}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Time Duration:</label>
            <input
              value={timeDuration}
              onChange={(e) => setTimeDuration(e.target.value)}
              type="text"
              placeholder="e.g., 5:30"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => router.push(`/video-organizer/view/${videoId}`)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Video"}
            </button>
          </div>
        </form>
      </main>
    </PasswordProtection>
  );
}

export default function EditPage() {
  return (
    <ToastProvider>
      <EditPageContent />
    </ToastProvider>
  );
}
