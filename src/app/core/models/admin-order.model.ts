export interface IAdminOrderItem {
  product: string;
  name: string;
  imgURL: string;
  quantity: number;
  price: number;
}
export interface IAdminOrderUser {
  _id: string;
  name: string;
  email: string;
}
export interface IAdminShippingAddress {
  governorate: string;
  city: string;
  street: string;
  phone: string;
}
export interface IAdminOrder {
  _id: string;
  user: IAdminOrderUser;
  items: IAdminOrderItem[];
  shippingAddress: IAdminShippingAddress;
  itemsTotal: number;
  shippingPrice: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
export interface IAdminOrdersRes {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: IAdminOrder[];
}
export const ORDER_STATUSES = [
  'pending',
  'shipped',
  'delivered',
  'received',
  'cancelled_by_client',
  'cancelled_by_admin',
  'rejected',
  'refunded',
];