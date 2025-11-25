"use client";
import { useState, FormEvent, KeyboardEvent } from "react";
import styles from "./page.module.css";
import VideoOrganizerNavbar from "./components/navbar";
import PasswordProtection from "./components/PasswordProtection";
import { videoApi } from "./utils/videoApi";

export default function HomePage() {
  const [link, setLink] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [timeDuration, setTimeDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
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
      });

      // Clear form on success
      setLink("");
      setTags([]);
      setTagInput("");
      setTimeDuration("");
      alert("Data submitted!");
    } catch {
      alert("Failed to submit video. Please try again.");
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
            <label>Tags:</label>
            <div className={styles.tagInputContainer}>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                type="text"
                placeholder="Type a tag and press Enter or click Add"
                className={styles.input}
              />
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

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Video"}
          </button>
        </form>
      </main>
    </PasswordProtection>
  );
}
