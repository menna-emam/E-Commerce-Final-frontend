import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IRegisterData } from '../../core/models/auth.model';
import { ICanDeactivate } from '../../core/models/canDeactivate.model';     

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements ICanDeactivate {                                
  private _authService = inject(AuthService);
  private _router = inject(Router);
  errorMessage = '';
  isLoading = false;
  canDeactivate(): boolean {
    if (this.signupForm.dirty) {
      return confirm('are you sure?');
    }
    return true;
  }
  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    this._authService.register(this.signupForm.value as IRegisterData).subscribe({
      next: () => {
        this.signupForm.reset();                                               
        this._router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Something went wrong, please try again';
        this.isLoading = false;
      },
    });
  }
}