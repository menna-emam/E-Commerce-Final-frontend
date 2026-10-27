import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem, CartResponse } from '../models/cart.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { enveronment } from '../../../environments/env';

@Service()
export class CartService {
  private _http = inject(HttpClient);
  private _authService = inject(AuthService);
  private _apiURL = enveronment.apiURL + 'cart';
  private _key = 'cart';
  private _isLoggedIn = false;
  private _items$ = new BehaviorSubject<CartItem[]>(this._loadLocal());
  constructor() {
    this._authService.getUserData().subscribe((user) => {
      if (user && user.role === 'user') {
        this._isLoggedIn = true;
        this._mergeLocalThenLoad();
      } else {
        this._isLoggedIn = false;
        this._items$.next(this._loadLocal());
      }
    });
  }
  getItems() {
    return this._items$.asObservable();
  }
  getCount() {
    return this._items$.pipe(
      map((items) => items.reduce((sum, i) => sum + i.quantity, 0)),
    );
  }
  getTotal() {
    return this._items$.pipe(
      map((items) => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)),
    );
  }
  add(product: Product, quantity = 1) {
    if (this._isLoggedIn) {
      this._http.post(`${this._apiURL}/items`, { product: product._id, quantity }).subscribe({
        next: () => this._loadFromServer(),
        error: (err) => alert(err.error?.error || 'could not add to the cart'),
      });
      return;
    }
    const current = this._items$.value;
    const existing = current.find((i) => i.product._id === product._id);
    let items: CartItem[];
    if (existing) {
      items = current.map((i) =>
        i.product._id === product._id
          ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
          : i,
      );
    } else {
      items = [
        ...current,
        {
          product: {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            imgURL: product.imgURL,
            price: product.price,
            stock: product.stock,
          },
          quantity: Math.min(quantity, product.stock),
        },
      ];
    }
    this._saveLocal(items);
  }
  setQuantity(productId: string, quantity: number) {
    if (this._isLoggedIn) {
      const item = this._items$.value.find((i) => i.product._id === productId);
      const max = item ? item.product.stock : quantity;
      const safe = Math.min(Math.max(quantity, 1), max);
      this._http.patch(`${this._apiURL}/items/${productId}`, { quantity: safe }).subscribe({
        next: () => this._loadFromServer(),
        error: (err) => alert(err.error?.error || 'could not update the cart'),
      });
      return;
    }
    const items = this._items$.value.map((i) =>
      i.product._id === productId
        ? { ...i, quantity: Math.min(Math.max(quantity, 1), i.product.stock) }
        : i,
    );
    this._saveLocal(items);
  }
  remove(productId: string) {
    if (this._isLoggedIn) {
      this._http.delete(`${this._apiURL}/items/${productId}`).subscribe({
        next: () => this._loadFromServer(),
      });
      return;
    }
    this._saveLocal(this._items$.value.filter((i) => i.product._id !== productId));
  }
  clear() {
    if (this._isLoggedIn) {
      this._http.delete(this._apiURL).subscribe({
        next: () => this._loadFromServer(),
      });
      return;
    }
    this._saveLocal([]);
  }
  reload() {
    if (this._isLoggedIn) {
      this._loadFromServer();
    }
  }
  private _loadFromServer() {
    this._http.get<CartResponse>(this._apiURL).subscribe({
      next: (res) => this._items$.next(res.data.items),
    });
  }
  private _mergeLocalThenLoad() {
    const local = this._loadLocal();
    if (local.length === 0) {
      this._loadFromServer();
      return;
    }
    const items = local.map((i) => ({ product: i.product._id, quantity: i.quantity }));
    this._http.post(`${this._apiURL}/merge`, { items }).subscribe({
      next: () => {
        localStorage.removeItem(this._key);
        this._loadFromServer();
      },
      error: () => this._loadFromServer(),
    });
  }
  private _saveLocal(items: CartItem[]) {
    localStorage.setItem(this._key, JSON.stringify(items));
    this._items$.next(items);
  }
  private _loadLocal(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(this._key) || '[]');
    } catch {
      return [];
    }
  }
}