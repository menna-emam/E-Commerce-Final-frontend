export interface CartProduct {
  _id: string;
  name: string;
  slug: string;
  imgURL: string;
  price: number;
  stock: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  priceWhenAdded?: number;
  priceChanged?: boolean;
  isAvailable?: boolean;
  exceedsStock?: boolean;
  isLowStock?: boolean;
  lineTotal?: number;
}

export interface CartResponse {
  message: string;
  data: { items: CartItem[]; total: number };
}