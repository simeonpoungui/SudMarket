import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse, CodeResponseOneVente, GetVente, Vente } from '../Models/vente.model';

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  uriget = ""
  uricreate = ""
  uridelete = ""
  uriupdate = ""

  constructor(private httpclient: HttpClient) { }

  getList(vente: GetVente): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriget, vente)
  }
  getOne(vente: GetVente): Observable<CodeResponseOneVente>{
    return this.httpclient.post<CodeResponseOneVente>(environment.apiUrl + this.uriget, vente)
  }
  delete(vente: Vente){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uridelete, vente)
  }
  update(vente: Vente){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdate, vente)
  }
  create(vente: Vente){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreate, vente)
  }

}
