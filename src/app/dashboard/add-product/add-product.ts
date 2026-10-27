import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
import { AdminProductService } from '../../core/services/admin-product.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-add-product',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  private _productService = inject(AdminProductService);
  private _categoryService = inject(CategoryService);
  private _router = inject(Router);

  seasons = ['summer', 'winter', 'autumn'];
  selectedFile: File | null = null;
  fileError = false;
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
  subCategories$ = this.productForm.controls.category.valueChanges.pipe(
    tap(() => this.productForm.controls.subCategory.setValue('')),
    switchMap((categoryId) =>
      categoryId ? this._categoryService.getSubCategories(categoryId) : of(null),
    ),
  );
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files && input.files.length > 0 ? input.files[0] : null;
    this.fileError = false;
  }
  onSubmit() {
    if (!this.selectedFile) {
      this.fileError = true;
    }
    if (this.productForm.invalid || !this.selectedFile) {
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
    formData.append('img', this.selectedFile);

    this.errorMessage = '';
    this.isLoading = true;
    this._productService.addProduct(formData).subscribe({
      next: () => this._router.navigate(['/dashboard/products']),
      error: (err) => {
        this.errorMessage = err.error?.error || 'Something went wrong, please try again';
        this.isLoading = false;
      },
    });
  }
}