import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
export const errorHandelarInterceptor: HttpInterceptorFn = (req, next) => {
  const _router = inject(Router);
  return next(req).pipe(
    catchError((error) => {
      console.log(error);
      if (error.status === 401) {
        _router.navigate(['/login']);
      } else if (error.status === 403) {
        _router.navigate(['/login']);
      } else if (error.status === 404) {
        _router.navigate(['/not-found']);
      } else if (error.status === 500) {
        alert(error.error?.message || `something went wrong, please try again`);
      }
      return throwError(() => error);
    }),
  );
};