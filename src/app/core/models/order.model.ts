export interface IOrderItem {
  product: string;
  name: string;
  imgURL: string;
  quantity: number;
  price: number; 
}
export interface IShippingAddress {
  governorate: string;
  city: string;
  street: string;
  phone: string;
}
export interface IOrder {
  _id: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  itemsTotal: number;
  shippingPrice: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}
export interface IOrderRes {
  message: string;
  data: IOrder;
}
export interface IOrdersRes {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: IOrder[];
}