import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // no añadimos token a /auth/login
    if (req.url.includes('/auth/login')) return next.handle(req);

    const token = localStorage.getItem('token');
    if (!token) return next.handle(req);

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    // DEBUG: ver qué sale con token
    //console.log('AuthInterceptor ->', authReq.method, authReq.url, authReq.headers.get('Authorization'));

    return next.handle(authReq);
  }
}
