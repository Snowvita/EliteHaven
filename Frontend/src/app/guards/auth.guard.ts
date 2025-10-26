import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/signin']);
    return false;
  }

  return true;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userDetailsStr = localStorage.getItem('userDetails');

  if (!userDetailsStr) {
    router.navigate(['/signin']);
    return false;
  }

  try {
    const userDetails = JSON.parse(userDetailsStr);
    const userRole = userDetails.role || ''; // Direct string property

    const expectedRole = route.data['role'];

    if (expectedRole && userRole !== expectedRole) {
      router.navigate(['/']);
      return false;
    }

    return true;
  } catch {
    router.navigate(['/signin']);
    return false;
  }
};
