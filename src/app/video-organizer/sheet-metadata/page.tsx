"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { metadataApi, SheetMetadata } from "./utils";
import { sheetSelection } from "../utils/sheetSelection";
import VideoOrganizerNavbar from "../components/navbar";
import PasswordProtection from "../components/PasswordProtection";
import { ToastProvider } from "../components/ToastProvider";

function SheetMetadataListContent() {
  const router = useRouter();
  const [data, setData] = useState<SheetMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectingId, setSelectingId] = useState<number | null>(null);
  const [selectedSheetId, setSelectedSheetId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
    // Load current selected sheet
    const selected = sheetSelection.getSelectedSheet();
    if (selected) {
      const sheetData = data.find((d) => d.google_sheet_id === selected.google_sheet_id);
      if (sheetData && sheetData.rowId !== undefined) {
        setSelectedSheetId(sheetData.rowId);
      }
    }
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await metadataApi.getAll();
      setData(result);
      // Load current selected sheet after data loads
      const selected = sheetSelection.getSelectedSheet();
      if (selected) {
        const sheetData = result.find((d) => d.google_sheet_id === selected.google_sheet_id);
        if (sheetData && sheetData.rowId !== undefined) {
          setSelectedSheetId(sheetData.rowId);
        }
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

  const handleSelectSheet = async (item: SheetMetadata) => {
    if (item.rowId === undefined) return;

    setSelectingId(item.rowId);
    try {
      sheetSelection.setSelectedSheet({
        id: item.id,
        name: item.name,
        google_sheet_id: item.google_sheet_id,
      });
      setSelectedSheetId(item.rowId);
      showToast(`Selected sheet: ${item.name}`, "success");
    } catch (error) {
      console.error("Error selecting sheet:", error);
      showToast("Failed to select sheet", "error");
    } finally {
      setSelectingId(null);
    }
  };

  const handleDelete = async (rowId: number | undefined) => {
    if (rowId === undefined) return;
    
    if (!confirm("Are you sure you want to delete this metadata?")) return;

    setDeletingId(rowId);
    try {
      // Since the API doesn't have a DELETE endpoint, we'll show a message
      showToast("Delete functionality not implemented in API yet", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredData = data.filter((item) => {
    if (!searchQuery.trim()) return true;
    return (
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.google_sheet_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <PasswordProtection>
      <VideoOrganizerNavbar />
      <main className={styles.container}>
        <h1>Sheet Metadata Management</h1>

        <div className={styles.header}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search by ID, Name, or Sheet ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className={styles.clearBtn}>
                Clear
              </button>
            )}
          </div>
          <div className={styles.addBtnContainer}>
            <Link href="/video-organizer/sheet-metadata/add" className={styles.addBtn}>
              + Add New Sheet
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
            <p className={styles.loadingText}>Loading metadata...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <p className={styles.noResults}>
            {data.length === 0
              ? "No sheet metadata found. Create one to get started!"
              : "No metadata found matching your search."}
          </p>
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Google Sheet ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {filteredData.map((item) => (
                <tr key={item.rowId} className={selectedSheetId === item.rowId ? styles.selectedRow : ""}>
                  <td className={styles.idCell}>{item.id}</td>
                  <td className={styles.nameCell}>{item.name}</td>
                  <td className={styles.sheetIdCell} title={item.google_sheet_id}>
                    {item.google_sheet_id}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleSelectSheet(item)}
                        className={`${styles.selectBtn} ${selectedSheetId === item.rowId ? styles.selectBtnActive : ""}`}
                        disabled={selectingId === item.rowId}
                      >
                        {selectingId === item.rowId
                          ? "Selecting..."
                          : selectedSheetId === item.rowId
                          ? "✓ Selected"
                          : "Select"}
                      </button>
                      <Link
                        href={`/video-organizer/sheet-metadata/edit/${item.rowId}`}
                        className={styles.editLink}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.rowId)}
                        className={styles.deleteBtn}
                        disabled={deletingId === item.rowId}
                      >
                        {deletingId === item.rowId ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {toast && (
          <div className={`${styles.toast} ${toast.type === "error" ? styles.error : ""}`}>
            {toast.message}
          </div>
        )}
      </main>
    </PasswordProtection>
  );
}

export default function SheetMetadataList() {
  return (
    <ToastProvider>
      <SheetMetadataListContent />
    </ToastProvider>
  );
}
