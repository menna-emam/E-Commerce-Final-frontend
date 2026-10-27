import { inject, Service } from '@angular/core';
import {ActivatedRouteSnapshot,MaybeAsync,RedirectCommand,Resolve,
  Router,RouterStateSnapshot,
} from '@angular/router';
import { catchError, of } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
export interface IProductRes {
  message: string;
  data: Product;
}
@Service()
export class ProductDetailsResolver implements Resolve<IProductRes | null> {
  private _productService = inject(ProductService);
  private _router = inject(Router);
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): MaybeAsync<IProductRes | RedirectCommand | null> {
    const slug = route.paramMap.get('slug');
    if (slug) {
      return this._productService.getProductBySlug(slug).pipe(
        catchError(() => {
          this._router.navigate(['/products']);
          return of(null);
        }),
      );
    }
    return of(null);
  }
}