export interface IGovernorate {
  _id: string;
  name: string;
  shippingPrice: number;
}
export interface IGovernorateRes {
  message: string;
  data: IGovernorate[];
}