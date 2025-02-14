import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Récupère le token de l'utilisateur dans sessionStorage
    const token = sessionStorage.getItem('auth_token');

    // Si le token existe, on l'ajoute dans l'en-tête Authorization
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }

    // Sinon, on continue la requête sans le token
    return next.handle(req);
  }
}
