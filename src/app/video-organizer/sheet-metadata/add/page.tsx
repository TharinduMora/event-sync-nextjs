"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { metadataApi } from "../utils";
import VideoOrganizerNavbar from "../../components/navbar";
import PasswordProtection from "../../components/PasswordProtection";
import { ToastProvider } from "../../components/ToastProvider";

function AddSheetMetadataContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    google_sheet_id: "",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.id.trim() || !formData.name.trim() || !formData.google_sheet_id.trim()) {
      showToast("All fields are required", "error");
      return;
    }

    setIsLoading(true);
    try {
      await metadataApi.create({
        id: formData.id,
        name: formData.name,
        google_sheet_id: formData.google_sheet_id,
      });
      showToast("Sheet metadata created successfully!", "success");
      setTimeout(() => router.push("/video-organizer/sheet-metadata"), 1500);
    } catch (error) {
      console.error("Error creating metadata:", error);
      showToast("Failed to create sheet metadata", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PasswordProtection>
      <VideoOrganizerNavbar />
      <main className={styles.container}>
        <h1>Add New Sheet Metadata</h1>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="id">ID *</label>
              <input
                type="text"
                id="id"
                placeholder="e.g., sheet-001"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                placeholder="e.g., Production Data Sheet"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
                required
              />
              <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
                Note: This value will be encrypted when stored.
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="google_sheet_id">Google Sheet ID *</label>
              <input
                type="text"
                id="google_sheet_id"
                placeholder="e.g., 1BxiMVs0XRA5nFMKUVfIgIIUcEP4zM8y8-QQB_fXkJ5s"
                value={formData.google_sheet_id}
                onChange={(e) => setFormData({ ...formData, google_sheet_id: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

            <div className={styles.formActions}>
              <Link href="/video-organizer/sheet-metadata" className={styles.cancelBtn}>
                Cancel
              </Link>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Sheet Metadata"}
              </button>
            </div>
          </form>
        </div>

        {toast && (
          <div className={`${styles.toast} ${toast.type === "error" ? `${styles.toast} ${styles.error}` : styles.toast}`}>
            {toast.message}
          </div>
        )}
      </main>
    </PasswordProtection>
  );
}

export default function AddSheetMetadata() {
  return (
    <ToastProvider>
      <AddSheetMetadataContent />
    </ToastProvider>
  );
}
