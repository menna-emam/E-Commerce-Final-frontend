import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { IOrder } from '../../core/models/order.model';
import { enveronment } from '../../../environments/env';

@Component({
  selector: 'app-my-orders',
  imports: [DatePipe, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  private _orderService = inject(OrderService);
  private _cdr = inject(ChangeDetectorRef);
  imgBase = enveronment.staticURL;
  orders: IOrder[] = [];
  isLoading = true;
  errorMessage = '';
  ngOnInit() {
    this._orderService.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res.data;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Could not load your orders';
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }

  cancel(order: IOrder) {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    this._orderService.cancelOrder(order._id).subscribe({
      next: (res) => {
        this.orders = this.orders.map((o) => (o._id === order._id ? res.data : o));
        this._cdr.detectChanges();
      },
      error: (err) => {
        alert(err.error?.error || 'Could not cancel the order');
      },
    });
  }
  statusLabel(status: string) {
    return status.replaceAll('_', ' ');
  }
  statusClass(status: string) {
    switch (status) {
      case 'pending':
        return 'text-bg-warning';
      case 'shipped':
        return 'text-bg-info';
      case 'delivered':
      case 'received':
        return 'text-bg-success';
      case 'refunded':
        return 'text-bg-secondary';
      default:
        return 'text-bg-danger'; 
    }
  }
}