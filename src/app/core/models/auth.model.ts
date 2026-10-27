export interface ILoginData {
  email: string;
  password: string;
}
export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}
export interface ILoginRes {
  message: string;
  data: string;
}
export interface IToken {
  _id: string;
  name: string;
  role: string;
  exp: number;
}