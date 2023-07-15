export interface Category {
  id: number;
  name: string;
  photo: CategoryPhoto
  status: any;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPhoto {
  id: string;
  name: string;
  fileName: string;
  path: string;
}
