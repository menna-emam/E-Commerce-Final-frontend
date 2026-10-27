export interface INotification {
  _id: string;
  type: string;
  message: string;
  refId: string;
  isRead: boolean;
  createdAt: string;
}

export interface INotificationsRes {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  unreadCount: number;
  data: INotification[];
}