export interface IAdminTestimonial {
  _id: string;
  user: { _id: string; name: string };
  message: string;
  status: string;
  createdAt: string;
}

export interface IAdminTestimonialsRes {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: IAdminTestimonial[];
}