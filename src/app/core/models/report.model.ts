export interface IReportOverall {
  totalOrders: number;
  itemsRevenue: number;
  shippingRevenue: number;
  totalRevenue: number;
}
export interface IReportProduct {
  _id: string;
  name: string;
  imgURL: string;
  quantitySold: number;
  revenue: number;
}
export interface IReportCustomer {
  _id: string;
  name: string;
  email: string;
  totalSpent: number;
  totalOrders: number;
}
export interface IReportMonth {
  _id: { year: number; month: number };
  orders: number;
  revenue: number;
}
export interface ISalesReportRes {
  message: string;
  data: {
    overall?: IReportOverall; 
    topProducts: IReportProduct[];
    topCustomers: IReportCustomer[];
    monthlySales: IReportMonth[];
  };
}