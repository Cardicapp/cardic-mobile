import { Category } from "./category";

export interface SubCategory {
  id: number;
  name: string;
  nairaRate: number;
  minAmount: number;
  maxAmount: number;
  category: Category;
  status: any;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
