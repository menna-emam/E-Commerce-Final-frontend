import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ILoginData } from '../../core/models/auth.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private _authService = inject(AuthService);
  private _route = inject(ActivatedRoute);
  private _returnUrl = this._getReturnUrl();
  errorMessage = '';
  isLoading = false;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    this._authService.login(this.loginForm.value as ILoginData, this._returnUrl).subscribe({
      error: (err) => {
        this.errorMessage = err.error?.error || 'Something went wrong, please try again';
        this.isLoading = false;
      },
    });
  }
  private _getReturnUrl() {
    const url = this._route.snapshot.queryParamMap.get('returnUrl');
    return url && url.startsWith('/') ? url : '/';
  }
}