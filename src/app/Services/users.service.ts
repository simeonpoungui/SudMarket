import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CodeResponseOneUser, GetUser, ImageUser, Utilisateur } from '../Models/users.model';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse } from '../Models/users.model';
import { Client } from '../Models/clients.model';
import { GetPointsDeVentes } from '../Models/pointsDeVentes.model';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpclient: HttpClient) { }

  urigetuses = "/v1/sudmarket/get/users"
  uriupdateuser = "/v1/sudmarket/update/users"
  uricreateuser = "/v1/sudmarket/create/users"
  urideleteuser = "/v1/sudmarket/delete/users"
  uriuserbypointdevente = "/v1/sudmarket/get/user-by-point-vente"
  uriimprimeuserspdflist = "/v1/sudmarket/impression/utilisateurs"
  urigetimagebyuser = "/v1/sudmarket/get/image/by-user"
  uricreateupdateimagebyuser = "/v1/sudmarket/update/create/image/user"

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

  getUserByPointVente(point: GetPointsDeVentes){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriuserbypointdevente, point)
  }

  getListUsersPDF(data: Utilisateur[]): Observable<any> {
    console.log(environment.apiUrl + this.uriimprimeuserspdflist);
    return this.httpclient.post(environment.apiUrl + this.uriimprimeuserspdflist, data , {
      responseType: 'blob' as 'json'
    });
  }

  getImageByUser(user: GetUser){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urigetimagebyuser, user)
  }

  updateCreateImageByUser(modelimage: ImageUser){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreateupdateimagebyuser, modelimage)
  }
}
