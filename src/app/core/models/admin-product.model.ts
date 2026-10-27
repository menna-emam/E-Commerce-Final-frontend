import { Product } from './product.model';
export interface IAdminProduct extends Product {
  isActive: boolean;
  category: { _id: string; name: string; slug: string };                      
  subCategory: { _id: string; name: string; slug: string };                  
}
export interface IAdminProductsRes {
  message: string;
  data: IAdminProduct[];
}