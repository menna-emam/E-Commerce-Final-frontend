export interface IGovernorateInfo {
  _id: string;
  name: string;
  shippingPrice: number;
}
export interface IAddress {
  _id: string;
  governorate: IGovernorateInfo;
  city: string;
  street: string;
  phone: string;
  isDefault: boolean;
}
export interface IAddressData {
  governorate: string;
  city: string;
  street: string;
  phone: string;
  isDefault: boolean;
}
export interface IProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  addresses: IAddress[];
}
export interface IProfileRes {
  message: string;
  data: IProfile;
}