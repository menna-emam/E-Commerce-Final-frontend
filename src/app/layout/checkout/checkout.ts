import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { UserService } from '../../core/services/user.service';
import { OrderService } from '../../core/services/order.service';            
import { IAddress } from '../../core/models/user.model';
import { IOrderRes } from '../../core/models/order.model';                   
import { enveronment } from '../../../environments/env';

@Component({
  selector: 'app-checkout',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private _cartService = inject(CartService);
  private _userService = inject(UserService);
  private _orderService = inject(OrderService);                              
  imgBase = enveronment.staticURL;
  items$ = this._cartService.getItems();
  total$ = this._cartService.getTotal();
  selectedAddress: IAddress | null = null;
  isLoading = false;                                                          
  errorMessage = '';                                                         
  placedOrder: IOrderRes['data'] | null = null;                               
  profile$ = this._userService.getMyProfile().pipe(
    tap((res) => {
      const addresses = res.data.addresses;
      this.selectedAddress = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;
    }),
  );
  selectAddress(address: IAddress) {
    this.selectedAddress = address;
  }
  get shipping() {
    return this.selectedAddress?.governorate.shippingPrice ?? 0;
  }
  placeOrder() {
    if (!this.selectedAddress) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this._orderService.createOrder(this.selectedAddress._id).subscribe({
      next: (res) => {
        this.placedOrder = res.data;
        this.isLoading = false;
        this._cartService.reload();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Something went wrong, please try again';
        this.isLoading = false;
      },
    });
  }
}