"use client";
import { useState, useEffect, FormEvent, KeyboardEvent } from "react";
import styles from "./page.module.css";
import VideoOrganizerNavbar from "./components/navbar";
import PasswordProtection from "./components/PasswordProtection";
import { ToastProvider, useToast } from "./components/ToastProvider";
import { videoApi } from "./utils/videoApi";
import { videoStorage } from "./utils/videoStorage";

function HomePageContent() {
  const { showToast } = useToast();
  const [link, setLink] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [timeDuration, setTimeDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Load available tags from localStorage
    const tags = videoStorage.getAllTags();
    setAvailableTags(tags);
  }, []);

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

      // Use API service to submit video
      await videoApi.submitVideo({
        link,
        tags: tagsString,
        timeDuration,
        thumbnail
      });

      // Clear form on success
      setLink("");
      setThumbnail("");
      setTags([]);
      setTagInput("");
      setTimeDuration("");
      showToast("Video submitted successfully!", "success");
    } catch {
      showToast("Failed to submit video. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PasswordProtection>
      <VideoOrganizerNavbar />
      <main className={styles.container}>
        <h1>Submit Video Entry</h1>
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
            <label>Thumbnail:</label>
            <input
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              type="url"
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
              value={timeDuration || 0}
              onChange={(e) => setTimeDuration(e.target.value)}
              type="text"
              placeholder="e.g., 5:30"
              required
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Video"}
          </button>
        </form>
      </main>
    </PasswordProtection>
  );
}

export default function HomePage() {
  return (
    <ToastProvider>
      <HomePageContent />
    </ToastProvider>
  );
}
