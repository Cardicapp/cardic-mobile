import { Category } from "./category";

export interface SubCategory {
  id: number;
  name: string;
  nairaRate: number;
  category: Category;
  status: any;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
