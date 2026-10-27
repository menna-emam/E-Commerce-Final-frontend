import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { enveronment } from '../../../environments/env';
import { INotificationsRes } from '../models/notification.model';

export interface NotificationFilters {
  unread?: string;
  page?: number;
  limit?: number;
}
@Service()
export class NotificationService {
  private _http = inject(HttpClient);
  private _apiURL = enveronment.apiURL + 'notification';
  private _unreadCount$ = new BehaviorSubject<number>(0);
  getUnreadCount() {
    return this._unreadCount$.asObservable();
  }
  getNotifications(filters: NotificationFilters = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this._http
      .get<INotificationsRes>(this._apiURL, { params })
      .pipe(tap((res) => this._unreadCount$.next(res.unreadCount)));
  }

  refreshCount() {
    this._http
      .get<INotificationsRes>(this._apiURL, { params: { limit: 1 } })
      .subscribe({ next: (res) => this._unreadCount$.next(res.unreadCount) });
  }
  markAsRead(id: string) {
    return this._http.patch(this._apiURL + '/' + id + '/read', {});
  }
  markAllAsRead() {
    return this._http.patch(this._apiURL + '/read-all', {});
  }
}