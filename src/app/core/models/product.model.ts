export interface CategoryInfo {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  desc: string;
  price: number;
  imgURL: string;
  stock: number;
  season: string;
  isInStock: boolean;
  isLowStock: boolean;
  category: CategoryInfo;
  subCategory: CategoryInfo;
}

export interface ProductsResponse {
  message: string;
  data: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}