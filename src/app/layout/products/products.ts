import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';                                  
import { BehaviorSubject, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { ProductFilters, ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-products',
  imports: [AsyncPipe, ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private _productService = inject(ProductService);
  private _categoryService = inject(CategoryService);
  private _route = inject(ActivatedRoute);                                         
  selectedCategory = '';                                                          
  private _filters$ = new BehaviorSubject<ProductFilters>({ page: 1, limit: 4 });
  products$ = this._filters$.pipe(
    switchMap((filters) => this._productService.getProducts(filters)),
  );
  categories$ = this._categoryService.getCategories();
  subCategories$ = this._filters$.pipe(
    map((filters) => filters.category),
    distinctUntilChanged(),
    switchMap((categoryId) =>
      categoryId ? this._categoryService.getSubCategories(categoryId) : of(null),
    ),
  );
  constructor() {
    this._route.queryParamMap.subscribe((params) => {
      const category = params.get('category') ?? '';
      this.selectedCategory = category;
      this._filters$.next({ ...this._filters$.value, category, subCategory: '', page: 1 });
    });
  }
  onCategoryChange(category: string) {
    this.selectedCategory = category;                                             
    this._filters$.next({ ...this._filters$.value, category, subCategory: '', page: 1 });
  }
  onSubCategoryChange(subCategory: string) {
    this._filters$.next({ ...this._filters$.value, subCategory, page: 1 });
  }
  onSeasonChange(season: string) {
    this._filters$.next({ ...this._filters$.value, season, page: 1 });
  }
  onSortChange(sort: string) {
    this._filters$.next({ ...this._filters$.value, sort, page: 1 });
  }
  onPageChange(page: number) {
    this._filters$.next({ ...this._filters$.value, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  pages(total: number) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}