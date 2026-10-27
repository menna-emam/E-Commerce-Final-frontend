import { CanActivateFn } from '@angular/router';

export const userMatchGuard: CanActivateFn = (route, state) => {
  return true;
};
