import { Component, inject, OnDestroy, OnInit } from '@angular/core';           
import { AsyncPipe } from '@angular/common';                                       
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  imports: [RouterLink, RouterLinkActive, AsyncPipe],                           
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header implements OnInit, OnDestroy {                           
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _notificationService = inject(NotificationService);                      
  unreadCount$ = this._notificationService.getUnreadCount();                       
  private _timer: ReturnType<typeof setInterval> | undefined;                      
  ngOnInit() {
    this._notificationService.refreshCount();
    this._timer = setInterval(() => this._notificationService.refreshCount(), 30000);
  }

  ngOnDestroy() {
    clearInterval(this._timer);
  }
  logout() {
    this._authService.logOut();
    this._router.navigate(['/login']);
  }
}