export interface Category {
    id: number;
    name: string;
    parentId: number | null; // null for top-level categories
    description?: string;
  }