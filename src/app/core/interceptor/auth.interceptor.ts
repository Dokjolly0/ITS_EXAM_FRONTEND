import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Jwt } from '../../services/jwt';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtSrv = inject(Jwt);
  const authToken = jwtSrv.getToken();

  const authReq = authToken
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`),
      })
    : req;

  return next(authReq);
};
