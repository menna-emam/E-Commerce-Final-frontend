import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { CartItem } from '../../core/models/cart.model';
import { enveronment } from '../../../environments/env';

@Component({
  selector: 'app-cart',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private _cartService = inject(CartService);
  private _authService = inject(AuthService);
  items$ = this._cartService.getItems();
  total$ = this._cartService.getTotal();
  user$ = this._authService.getUserData();
  showLoginPrompt = false;
  imgBase = enveronment.staticURL;
  increase(item: CartItem) {
    this._cartService.setQuantity(item.product._id, item.quantity + 1);
  }
  decrease(item: CartItem) {
    this._cartService.setQuantity(item.product._id, item.quantity - 1);
  }
  remove(item: CartItem) {
    this._cartService.remove(item.product._id);
  }
  clear() {
    this._cartService.clear();
  }
}