"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import styles from "../../page.module.css";
import { metadataApi, SheetMetadata } from "../../utils";
import VideoOrganizerNavbar from "../../../components/navbar";
import PasswordProtection from "../../../components/PasswordProtection";
import { ToastProvider } from "../../../components/ToastProvider";

function EditSheetMetadataContent() {
  const router = useRouter();
  const params = useParams();
  const rowId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState<SheetMetadata>({
    id: "",
    name: "",
    google_sheet_id: "",
    rowId,
  });
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowId]);

  const loadData = async () => {
    try {
      const allData = await metadataApi.getAll();
      const item = allData.find((d) => d.rowId === rowId);
      if (item) {
        setFormData(item);
      } else {
        showToast("Sheet metadata not found", "error");
        setTimeout(() => router.push("/video-organizer/sheet-metadata"), 1500);
      }
    } catch (error) {
      console.error("Error loading metadata:", error);
      showToast("Failed to load sheet metadata", "error");
    } finally {
      setIsLoading(false);
    }
  };

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

    setIsSaving(true);
    try {
      await metadataApi.update(rowId, {
        id: formData.id,
        name: formData.name,
        google_sheet_id: formData.google_sheet_id,
      });
      showToast("Sheet metadata updated successfully!", "success");
      setTimeout(() => router.push("/video-organizer/sheet-metadata"), 1500);
    } catch (error) {
      console.error("Error updating metadata:", error);
      showToast("Failed to update sheet metadata", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PasswordProtection>
        <VideoOrganizerNavbar />
        <main className={styles.container}>
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
            <p className={styles.loadingText}>Loading metadata...</p>
          </div>
        </main>
      </PasswordProtection>
    );
  }

  return (
    <PasswordProtection>
      <VideoOrganizerNavbar />
      <main className={styles.container}>
        <h1>Edit Sheet Metadata</h1>

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
                disabled={isSaving}
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
                disabled={isSaving}
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
                disabled={isSaving}
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
                disabled={isSaving}
              >
                {isSaving ? "Updating..." : "Update Sheet Metadata"}
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

export default function EditSheetMetadata() {
  return (
    <ToastProvider>
      <EditSheetMetadataContent />
    </ToastProvider>
  );
}
