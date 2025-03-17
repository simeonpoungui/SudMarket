import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse, CodeResponseOneProduit, GetProduit, ImageProduit, Produit } from '../Models/produit.model';
import { GetPointsDeVentes } from '../Models/pointsDeVentes.model';
import { Categorie } from '../Models/categorie.model';

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

  urigetvariationbyproduit = "/v1/sudmarket/get/variations"
  urigetcombinaisonsbyproduit = "/v1/sudmarket/get/combinaisons-by-produit"
  urigetcombinaisonbyid = "/v1/sudmarket/get/combinaisons-by-id"

  urigetvariationbyproduitentrepot = "/v1/sudmarket/get/variations/entrepots"
  urigetcombinaisonsbyproduitentrepo = "/v1/sudmarket/get/combinaisons-by-produit/entrepot"

  urigetcategorieproduit = "/v1/sudmarket/get/categorie/produits"
  uriupdatecategorieproduit = "/v1/sudmarket/update/categorie/produits"
  uricreateCategorieproduit = "/v1/sudmarket/create/categorie/produits"

  constructor(private httpclient: HttpClient) { }

  getList(produit: GetProduit): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriget, produit)
  }

  getOne(produit: GetProduit): Observable<CodeResponseOneProduit>{
    return this.httpclient.post<CodeResponseOneProduit>(environment.apiUrl + this.uriget, produit)
  }

  getVariationByProduitId(produit: GetProduit): Observable<any>{
    return this.httpclient.post<CodeResponseOneProduit>(environment.apiUrl + this.urigetvariationbyproduit, produit)
  }

  getCombinaisonByProduitId(produit: GetProduit): Observable<any>{
    return this.httpclient.post<CodeResponseOneProduit>(environment.apiUrl + this.urigetcombinaisonsbyproduit, produit)
  }


  getVariationByProduitIdEntrepot(produit: GetProduit): Observable<any>{
    return this.httpclient.post<CodeResponseOneProduit>(environment.apiUrl + this.urigetvariationbyproduitentrepot, produit)
  }

  getCombinaisonByProduitIdEntrepot(produit: GetProduit): Observable<any>{
    return this.httpclient.post<CodeResponseOneProduit>(environment.apiUrl + this.urigetcombinaisonsbyproduitentrepo, produit)
  }

  getCombinaisonById(id: number): Observable<any>{
    const data = {
      id:id
    }
    console.log(data);
    
    return this.httpclient.post<any>(environment.apiUrl + this.urigetcombinaisonbyid, data)
  }


  delete(produit: Produit){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uridelete, produit)
  }
  update(produit: Produit){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdate, produit)
  }
  create(produit: Produit):Observable<CodeResponse>{
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


// Categorie Produit
  getListCategorieProduit(): Observable<any>{const data = { categorie_id:0}
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urigetcategorieproduit,data)
  }

  updateCategorieProduit(categorie: Categorie){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdatecategorieproduit, categorie)
  }

  createCategoorieProduit(categorie: Categorie){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreateCategorieproduit, categorie)
  }
}
