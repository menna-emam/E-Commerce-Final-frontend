import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header implements OnInit {
  private _authService = inject(AuthService);
  private _cartService = inject(CartService);
  userName = '';
  cartCount$ = this._cartService.getCount();
  ngOnInit(): void {
    this._authService.getUserData().subscribe({
      next: (data) => {
        if (data) {
          this.userName = data.name;
        } else {
          this.userName = '';
        }
      },
      error: (err) => {},
    });
  }
  logout() {
    this._authService.logOut();
  }
}