import { Category } from "./category";
import { SubCategory } from "./sub-category";
import { User } from "./user";

export interface Trade {
    id: number;
    amount: number;
    cardAmount: number;
    currentRate: number;
    totalPaid: number;
    comment: string;
    category: Category;
    subCategory: SubCategory;
    user: User | null;
    assignee: User | null;
    status: any
  }