import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role, authStore } from '../store/auth.store';

export const roleGuard = (role: Exclude<Role, null>): CanActivateFn => async () => {
  await authStore.getState().init();
  const s = authStore.getState();
  if (s.role === role && s.account) return true;
  return inject(Router).createUrlTree([role === 'user' ? '/login' : '/restaurant/login']);
};

/** Login/register pages: bounce logged-in people to their home. */
export const guestGuard: CanActivateFn = async () => {
  await authStore.getState().init();
  const { role, account } = authStore.getState();
  if (!account) return true;
  return inject(Router).createUrlTree([role === 'restaurant' ? '/restaurant/dashboard' : '/app']);
};
