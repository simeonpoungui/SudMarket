import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Récupérer le token du localStorage
    const tokenStorage = localStorage.getItem('token');
    const token = tokenStorage ? JSON.parse(tokenStorage).token : null;
    console.log(token)
    // Vérifiez si le token existe
    if (token) {
      // Cloner la requête et ajouter l'en-tête Authorization
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Passer la requête clonée avec l'en-tête modifié au prochain gestionnaire
      return next.handle(authReq);
    }
    // Si aucun token, laisser la requête inchangée
    return next.handle(req);
  }
}
