export interface SheetMetadata {
  rowId?: number;
  id: string;
  name: string;
  google_sheet_id: string;
}

export const metadataApi = {
  async getAll(): Promise<SheetMetadata[]> {
    const res = await fetch("/api/sheet-metadata", {
      method: "GET",
    });
    if (!res.ok) throw new Error("Failed to fetch sheet metadata");
    const data = await res.json();
    return data.data || [];
  },

  async create(metadata: Omit<SheetMetadata, "rowId">): Promise<SheetMetadata> {
    const res = await fetch("/api/sheet-metadata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata),
    });
    if (!res.ok) throw new Error("Failed to create sheet metadata");
    return res.json();
  },

  async update(
    rowId: number,
    metadata: Omit<SheetMetadata, "rowId">
  ): Promise<SheetMetadata> {
    const res = await fetch("/api/sheet-metadata", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rowId, ...metadata }),
    });
    if (!res.ok) throw new Error("Failed to update sheet metadata");
    return res.json();
  },
};
