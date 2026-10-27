import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { enveronment } from '../../../environments/env';                    

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
  private _cartService = inject(CartService);
  imgBase = enveronment.staticURL;                                          
  justAdded = false;
  addToCart() {
    this._cartService.add(this.product);
    this.justAdded = true;
    setTimeout(() => (this.justAdded = false), 1500);
  }
}