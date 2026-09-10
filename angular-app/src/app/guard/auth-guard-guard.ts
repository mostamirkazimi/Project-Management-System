import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuhtService } from '../services/auth/auht.service';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuhtService);
  const router = inject(Router);

  return authService.checkAuth().pipe(

    map(() => {
      return true;
    }),

    catchError((error) => {

      console.log('Auth Guard:', error);

      return of(
        router.createUrlTree(['/login'])
      );

    })

  );
};