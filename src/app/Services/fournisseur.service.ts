import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse, CodeResponseOneFournisseur, Fournisseur, GetFournisseur } from '../Models/fournisseur.model';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  uriget = "/v1/sudmarket/get/fournisseurs"
  uricreate = "/v1/sudmarket/create/fournisseurs"
  uridelete = "/v1/sudmarket/delete/fournisseurs"
  uriupdate = "/v1/sudmarket/update/fournisseurs"

  constructor(private httpclient: HttpClient) { }

  getList(fournisseur: GetFournisseur): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriget, fournisseur)
  }
  getOne(fournisseur: GetFournisseur): Observable<CodeResponseOneFournisseur>{
    return this.httpclient.post<CodeResponseOneFournisseur>(environment.apiUrl + this.uriget, fournisseur)
  }
  delete(fournisseur: Fournisseur){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uridelete, fournisseur)
  }
  update(fournisseur: Fournisseur){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdate, fournisseur)
  }
  create(fournisseur: Fournisseur){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreate, fournisseur)
  }
}
