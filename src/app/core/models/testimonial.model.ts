export interface ITestimonial {
  _id: string;
  user: { _id: string; name: string };
  message: string;
  createdAt: string;
}
export interface ITestimonialsRes {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: ITestimonial[];
}
export interface IAddTestimonialRes {
  message: string;
}