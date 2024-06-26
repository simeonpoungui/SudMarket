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
  constructor(private httpclient: HttpClient,private globalService: GlobalService) { }

  login(login: Login): Observable<any>{
   return this.httpclient.post(environment.apiUrl + this.urilogin , login)
  }

  logout() {
    this.globalService.toastShow('Vous etes deconncté','Succès','success')
    localStorage.removeItem('user');
    window.location.reload();
   }

}
