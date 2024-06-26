import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse, CodeResponseOneProduit, GetProduit, Produit } from '../Models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  uriget = "/v1/sudmarket/get/produits"
  uricreate = "/v1/sudmarket/create/produits"
  uridelete = "/v1/sudmarket/delete/produits"
  uriupdate = "/v1/sudmarket/update/produits"

  constructor(private httpclient: HttpClient) { }

  getList(produit: GetProduit): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriget, produit)
  }
  getOne(produit: GetProduit): Observable<CodeResponseOneProduit>{
    return this.httpclient.post<CodeResponseOneProduit>(environment.apiUrl + this.uriget, produit)
  }
  delete(produit: Produit){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uridelete, produit)
  }
  update(produit: Produit){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdate, produit)
  }
  create(produit: Produit){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreate, produit)
  }

}
