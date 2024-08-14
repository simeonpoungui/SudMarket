import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { PointsDeVentes,CodeResponse,CodeResponseOnePointDeVente, GetPointsDeVentes } from '../Models/pointsDeVentes.model';
import { GetUser } from '../Models/users.model';

@Injectable({
  providedIn: 'root'
})
export class PointsDeVentesService {

  uriget = "/v1/sudmarket/get/pointsDeVentes"
  uricreate = "/v1/sudmarket/create/pointsDeVentes"
  uridelete = "/v1/sudmarket/delete/pointsDeVentes"
  uriupdate = "/v1/sudmarket/update/pointsDeVentes"
  uriimprimepointdevente = "/v1/sudmarket/impression/points/ventes"
  urigetpointbyuser = "/v1/sudmarket/get/pointsDeVentes/by-user"
  
  constructor(private httpclient: HttpClient) { }

  getList(pointdevente: GetPointsDeVentes): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriget, pointdevente)
  }
  getOne(pointdevente: GetPointsDeVentes): Observable<CodeResponseOnePointDeVente>{
    return this.httpclient.post<CodeResponseOnePointDeVente>(environment.apiUrl + this.uriget, pointdevente)
  }
  delete(pointdevente: PointsDeVentes){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uridelete, pointdevente)
  }
  update(pointdevente: PointsDeVentes){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdate, pointdevente)
  }
  create(pointdevente: PointsDeVentes){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreate, pointdevente)
  }

  getPointDeVenteByUsder(user: GetUser){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urigetpointbyuser, user)
  }


  getListPointsDeVentePDF(): Observable<any> {
    console.log(environment.apiUrl + this.uriimprimepointdevente);
    return this.httpclient.get(environment.apiUrl + this.uriimprimepointdevente, {
      responseType: 'blob' as 'json'
    });
  }


}
