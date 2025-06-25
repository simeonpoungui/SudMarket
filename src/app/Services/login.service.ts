import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { Login } from '../Models/login.model';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  urilogin = "/v1/sudmarket/login/users"
  uriasktoken = "/v1/sudmarket/ask/token"
  
  constructor(private httpclient: HttpClient,private globalService: GlobalService) { }

  login(login: Login): Observable<any>{
   return this.httpclient.post(environment.apiUrl + this.urilogin , login)
  }

  VerifyToken(token: any): Observable<any>{
    return this.httpclient.post(environment.apiUrl + this.uriasktoken , token)
   }

  logout() {
    localStorage.removeItem('user');
    this.globalService.toastShow('Vous etes deconnecté','Succès')
     window.location.reload();
   }

}
