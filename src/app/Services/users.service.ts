import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CodeResponseOneUser, GetUser, Utilisateur } from '../Models/users.model';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse } from '../Models/users.model';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpclient: HttpClient) { }

  urigetuses = "/v1/sudmarket/get/users"
  uriupdateuser = "/v1/sudmarket/update/users"
  uricreateuser = "/v1/sudmarket/create/users"
  urideleteuser = "/v1/sudmarket/delete/users"


  getListUser(user: GetUser): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urigetuses, user)
  }
  getOneUser(user: GetUser): Observable<CodeResponseOneUser>{
    return this.httpclient.post<CodeResponseOneUser>(environment.apiUrl + this.urigetuses, user)
  }
  deleteUser(user: Utilisateur){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urideleteuser, user)
  }
  updateUser(user: Utilisateur){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdateuser, user)
  }
  createUser(user: Utilisateur){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreateuser, user)
  }
}
