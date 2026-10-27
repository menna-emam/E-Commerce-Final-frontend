import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { AdminProductService } from '../../core/services/admin-product.service';
import { CategoryService } from '../../core/services/category.service';
import { enveronment } from '../../../environments/env';

@Component({
  selector: 'app-edit-product',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct {
  private _productService = inject(AdminProductService);
  private _categoryService = inject(CategoryService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  productId = this._route.snapshot.paramMap.get('id') ?? '';
  imgBase = enveronment.staticURL;
  currentImage = '';
  notFound = false;
  seasons = ['summer', 'winter', 'autumn'];
  selectedFile: File | null = null;
  errorMessage = '';
  isLoading = false;
  productForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    slug: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    ]),
    desc: new FormControl('', Validators.required),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    stock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    category: new FormControl('', Validators.required),
    subCategory: new FormControl('', Validators.required),
    season: new FormControl('', Validators.required),
  });
  categories$ = this._categoryService.getCategories();
  private _categoryId$ = new BehaviorSubject<string>('');

  subCategories$ = this._categoryId$.pipe(
    switchMap((id) => (id ? this._categoryService.getSubCategories(id) : of(null))),
  );
  constructor() {
    this._productService.getAllProducts().subscribe({
      next: (res) => {
        const product = res.data.find((p) => p._id === this.productId);
        if (!product) {this.notFound = true;
          return;
        }
        this.currentImage = product.imgURL;
        this.productForm.patchValue({
          name: product.name,
          slug: product.slug,
          desc: product.desc,
          price: product.price,
          stock: product.stock,
          category: product.category._id,
          subCategory: product.subCategory._id,
          season: product.season,
        });
        this._categoryId$.next(product.category._id);
      },
    });
  }
  onCategoryChange(categoryId: string) {
    this.productForm.controls.category.setValue(categoryId);
    this.productForm.controls.subCategory.setValue('');
    this._categoryId$.next(categoryId);
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files && input.files.length > 0 ? input.files[0] : null;
  }
  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const value = this.productForm.getRawValue();
    const formData = new FormData();
    formData.append('name', value.name ?? '');
    formData.append('slug', value.slug ?? '');
    formData.append('desc', value.desc ?? '');
    formData.append('price', String(value.price));
    formData.append('stock', String(value.stock));
    formData.append('category', value.category ?? '');
    formData.append('subCategory', value.subCategory ?? '');
    formData.append('season', value.season ?? '');
    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }
    this.errorMessage = '';
    this.isLoading = true;
    this._productService.updateProduct(this.productId, formData).subscribe({
      next: () => this._router.navigate(['/dashboard/products']),
      error: (err) => {
        this.errorMessage = err.error?.error || 'Something went wrong, please try again';
        this.isLoading = false;
      },
    });
  }
}