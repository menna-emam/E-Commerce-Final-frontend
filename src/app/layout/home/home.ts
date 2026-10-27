import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';      
import { TestimonialService } from '../../core/services/testimonial.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductCard } from '../../shared/product-card/product-card';
import { Category } from '../../core/models/category.model';                  

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, ProductCard, RouterLink, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private _productService = inject(ProductService);
  private _categoryService = inject(CategoryService);                        
  private _testimonialService = inject(TestimonialService);
  private _authService = inject(AuthService);
  private _cdr = inject(ChangeDetectorRef);
  products$ = this._productService.getProducts({ limit: 4, sort: '-createdAt' });
  categories$ = this._categoryService.getCategories();                       
  testimonials$ = this._testimonialService.getApproved();
  user$ = this._authService.getUserData();
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  testimonialForm = new FormGroup({
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500),
    ]),
  });
  categoryLabel(category: Category) {
    const labels: Record<string, string> = { women: 'Women', men: 'Men' };
    return labels[category.slug] ?? category.name;
  }
  onSubmit() {
    if (this.testimonialForm.invalid) {
      this.testimonialForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    const message = (this.testimonialForm.getRawValue().message ?? '').trim();
    this._testimonialService.add(message).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.testimonialForm.reset();
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Something went wrong, please try again';
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }
}