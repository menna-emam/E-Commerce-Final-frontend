export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface CategoriesResponse {
  message: string;
  data: Category[];
}