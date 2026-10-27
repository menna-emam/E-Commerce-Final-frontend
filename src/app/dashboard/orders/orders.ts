import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject, switchMap } from 'rxjs';
import { AdminOrderService, OrderFilters } from '../../core/services/admin-order.service';
import { IAdminOrder, ORDER_STATUSES } from '../../core/models/admin-order.model';

@Component({
  selector: 'app-orders',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  private _orderService = inject(AdminOrderService);
  statuses = ORDER_STATUSES;
  private _filters$ = new BehaviorSubject<OrderFilters>({ page: 1, limit: 10 });
  orders$ = this._filters$.pipe(
    switchMap((filters) => this._orderService.getAllOrders(filters)),
  );
  onStatusChange(status: string) {
    this._filters$.next({ ...this._filters$.value, status, page: 1 });
  }
  onPageChange(page: number) {
    this._filters$.next({ ...this._filters$.value, page });
  }
  changeStatus(order: IAdminOrder, select: HTMLSelectElement) {
    const status = select.value;
    if (status === order.status) {
      return;
    }
    if (!confirm(`Change order #${order._id.slice(-6)} to "${this.statusLabel(status)}"?`)) {
      select.value = order.status; 
      return;
    }
    this._orderService.updateStatus(order._id, status).subscribe({
      next: () => this._filters$.next({ ...this._filters$.value }),
      error: (err) => {
        alert(err.error?.error || 'could not change the status');
        select.value = order.status;
      },
    });
  }
  pages(total: number) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  statusLabel(status: string) {
    return status.replaceAll('_', ' ');
  }
  statusClass(status: string) {
    const colors: Record<string, string> = {
      pending: 'bg-warning text-dark',
      shipped: 'bg-info text-dark',
      delivered: 'bg-success',
      received: 'bg-success',
      cancelled_by_client: 'bg-secondary',
      cancelled_by_admin: 'bg-secondary',
      rejected: 'bg-danger',
      refunded: 'bg-dark',
    };
    return colors[status] ?? 'bg-secondary';
  }
}