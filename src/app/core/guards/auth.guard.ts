import { CanActivateFn, Router } from '@angular/router';

import { Jwt } from '../../services/jwt';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const jwt = inject(Jwt);
  const router = inject(Router);
  const token = jwt.getToken();
  // Se c'è il token, continua. Altrimenti, reindirizza al login.
  return token ? true : router.createUrlTree(['/login']);
};
