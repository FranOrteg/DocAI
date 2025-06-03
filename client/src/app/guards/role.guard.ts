import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';

export const roleGuard = (expectedRoles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const utilsService = inject(UtilsService);

    const token = utilsService.getToken();

    if (!token || !expectedRoles.includes(token.role)) {
      router.navigate(['/login']);
      return false;
    }

    return true;
  };
};
