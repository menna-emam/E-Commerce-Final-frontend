import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, switchMap } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { GovernorateService } from '../../core/services/governorate.service';
import { IAddressData } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private _userService = inject(UserService);
  private _governorateService = inject(GovernorateService);
  private _refresh$ = new BehaviorSubject<void>(undefined);
  profile$ = this._refresh$.pipe(switchMap(() => this._userService.getMyProfile()));
  governorates$ = this._governorateService.getGovernorates();
  showForm = false;
  errorMessage = '';
  isLoading = false;
  addressForm = new FormGroup({
    governorate: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    isDefault: new FormControl(false),
  });
  toggleForm() {
    this.showForm = !this.showForm;
    this.errorMessage = '';
  }
  onSubmit() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    this._userService.addAddress(this.addressForm.value as IAddressData).subscribe({
      next: () => {
        this.addressForm.reset
        ({ governorate: '', city: '', street: '', phone: '', isDefault: false });
        this.showForm = false;
        this.isLoading = false;
        this._refresh$.next();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Something went wrong, please try again';
        this.isLoading = false;
      },
    });
  }
  setDefault(addressId: string) {
    this._userService.updateAddress(addressId, { isDefault: true }).subscribe({
      next: () => this._refresh$.next(),
      error: (err) => alert(err.error?.error || 'could not update the address'),
    });
  }
  deleteAddress(addressId: string) {
    if (!confirm('Delete this address?')) {
      return;
    }

    this._userService.deleteAddress(addressId).subscribe({
      next: () => this._refresh$.next(),
      error: (err) => alert(err.error?.error || 'could not delete the address'),
    });
  }
}