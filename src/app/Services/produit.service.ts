import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse, CodeResponseOneProduit, GetProduit, ImageProduit, Produit } from '../Models/produit.model';
import { GetPointsDeVentes } from '../Models/pointsDeVentes.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  uriget = "/v1/sudmarket/get/produits"
  uricreate = "/v1/sudmarket/create/produits"
  uridelete = "/v1/sudmarket/delete/produits"
  uriupdate = "/v1/sudmarket/update/produits"
  uriproduitbypointvente = "/v1/sudmarket/get/produits-by-point-de-vente"
  uriimpressionetatsproduit = "/v1/sudmarket/impression/produits"
  uricreateupdateimagebyproduit = "/v1/sudmarket/update/create/image/produit"
  urigetimagebyproduit = "/v1/sudmarket/get/image/by-produit"

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

  getListProduityByPointVente(point: GetPointsDeVentes){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriproduitbypointvente, point)
  }

  getListProduitEtatPDF(data: Produit[]): Observable<any> {
    console.log(data);
    console.log(environment.apiUrl + this.uriimpressionetatsproduit);
    return this.httpclient.post(environment.apiUrl + this.uriimpressionetatsproduit, data, {
      responseType: 'blob' as 'json'
    });
  }

  updateCreateImageByProduit(modelimage: ImageProduit){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreateupdateimagebyproduit, modelimage)
  }

  getImageByProduit(produit: GetProduit){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urigetimagebyproduit, produit)
  }

}
