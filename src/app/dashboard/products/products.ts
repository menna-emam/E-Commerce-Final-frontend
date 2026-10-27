import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { AdminProductService } from '../../core/services/admin-product.service';
import { IAdminProduct } from '../../core/models/admin-product.model';      
import { enveronment } from '../../../environments/env';

@Component({
  selector: 'app-products',
  imports: [AsyncPipe, RouterLink],  
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private _productService = inject(AdminProductService);
  imgBase = enveronment.staticURL;
  private _refresh$ = new BehaviorSubject<void>(undefined);
  products$ = this._refresh$.pipe(switchMap(() => this._productService.getAllProducts()));
  toggleActive(product: IAdminProduct) {
    this._productService.setActive(product._id, !product.isActive).subscribe({
      next: () => this._refresh$.next(),
      error: (err) => alert(err.error?.error || 'could not update the product'),
    });
  }
  deleteProduct(product: IAdminProduct) {
    if (!confirm(`Delete "${product.name}"?`)) {
      return;
    }
    this._productService.deleteProduct(product._id).subscribe({
      next: () => this._refresh$.next(),
      error: (err) => alert(err.error?.error || 'could not delete the product'),
    });
  }
}