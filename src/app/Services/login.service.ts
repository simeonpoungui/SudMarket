import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { Login } from 'Models/model.login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  urilogin = "/v1/sudmarket/login/users"
  constructor(private httpclient: HttpClient) { }

  login(login: Login): Observable<any>{
   return this.httpclient.post(environment.apiUrl + this.urilogin , login)
  }

  logout() {
    localStorage.removeItem('user');
    window.location.reload();
   }

}