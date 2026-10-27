import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import {NotificationFilters,NotificationService,
} from '../../core/services/notification.service';
import { INotification } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  private _notificationService = inject(NotificationService);
  showUnreadOnly = false;
  private _filters$ = new BehaviorSubject<NotificationFilters>({ page: 1, limit: 10 });
  notifications$ = this._filters$.pipe(
    switchMap((filters) => this._notificationService.getNotifications(filters)),
  );
  setFilter(unreadOnly: boolean) {
    this.showUnreadOnly = unreadOnly;
    this._filters$.next({
      ...this._filters$.value,
      unread: unreadOnly ? 'true' : '',
      page: 1,
    });
  }
  onPageChange(page: number) {
    this._filters$.next({ ...this._filters$.value, page });
  }
  markAsRead(notification: INotification) {
    this._notificationService.markAsRead(notification._id).subscribe({
      next: () => this._refresh(),
      error: (err) => alert(err.error?.error || 'could not mark as read'),
    });
  }
  markAllAsRead() {
    this._notificationService.markAllAsRead().subscribe({
      next: () => this._refresh(),
      error: (err) => alert(err.error?.error || 'could not mark all as read'),
    });
  }
  private _refresh() {
    this._filters$.next({ ...this._filters$.value });
  }
  pages(total: number) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  icon(type: string) {
    const icons: Record<string, string> = {
      new_order: '🛍️',
      low_stock: '⚠️',
      out_of_stock: '⛔',
      new_testimonial: '💬',
    };
    return icons[type] ?? '🔔';
  }

  linkFor(type: string) {
    const links: Record<string, string> = {
      new_order: '/dashboard/orders',
      low_stock: '/dashboard/products',
      out_of_stock: '/dashboard/products',
     new_testimonial: '/dashboard/testimonials',
    };
    return links[type] ?? null;
  }
}