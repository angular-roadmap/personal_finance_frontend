import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // During SSR, always allow navigation (auth will be checked in browser)
  if (!isPlatformBrowser(platformId)) {
    console.log('[AuthGuard] Running on server - allowing navigation');
    return true;
  }

  const isValid = authService.isTokenValid();
  console.log('[AuthGuard] Is token valid?', isValid);
  console.log('[AuthGuard] isAuthenticated signal:', authService.isAuthenticated());
  
  if (isValid) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
