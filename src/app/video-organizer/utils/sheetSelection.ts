// Utility for managing selected sheet in local storage
const SELECTED_SHEET_KEY = "selectedGoogleSheet";

export interface SelectedSheet {
  id: string;
  name: string;
  google_sheet_id: string;
}

export const sheetSelection = {
  // Get the selected sheet
  getSelectedSheet: (): SelectedSheet | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(SELECTED_SHEET_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Set the selected sheet
  setSelectedSheet: (sheet: SelectedSheet): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(SELECTED_SHEET_KEY, JSON.stringify(sheet));
  },

  // Clear the selected sheet
  clearSelectedSheet: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SELECTED_SHEET_KEY);
  },

  // Check if a sheet is selected
  hasSelectedSheet: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(SELECTED_SHEET_KEY);
  },
};
