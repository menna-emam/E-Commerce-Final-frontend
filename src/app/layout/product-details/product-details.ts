import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCard } from '../../shared/product-card/product-card';
import { Product } from '../../core/models/product.model';
import { IProductRes } from '../../core/resolvers/product-details.resolver';   
import { enveronment } from '../../../environments/env';

@Component({
  selector: 'app-product-details',
  imports: [AsyncPipe, ProductCard],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private _route = inject(ActivatedRoute);
  private _productService = inject(ProductService);
  private _cartService = inject(CartService);
  imgBase = enveronment.staticURL;
  quantity = 1;
  justAdded = false;
  product$ = this._route.data.pipe(
    map((data) => data['productRes'] as IProductRes | null),
    tap(() => (this.quantity = 1)),
  );
  private _slug$ = this._route.paramMap.pipe(map((params) => params.get('slug')!));
  related$ = this._slug$.pipe(
    switchMap((slug) => this._productService.getRelatedProducts(slug)),
  );
  increase(product: Product) {
    if (this.quantity < product.stock) {
      this.quantity++;
    }
  }
  decrease() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  addToCart(product: Product) {
    this._cartService.add(product, this.quantity);
    this.justAdded = true;
    setTimeout(() => (this.justAdded = false), 1500);
  }
}