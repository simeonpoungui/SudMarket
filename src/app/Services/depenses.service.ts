import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environnement/environnement.prod';
import {
  Depense,
  GetDepense,
  CodeResponseDepense,
  CodeResponseOneDepense,
} from '../Models/depenses.model';

@Injectable({
  providedIn: 'root',
})
export class DepensesService {
  
  private uricreatedepense = '/v1/sudmarket/create/depenses';
  private urigetdepenses = '/v1/sudmarket/get/depenses';
  private uriupdatedepense = '/v1/sudmarket/update/depenses';
  private urideletedepense = '/v1/sudmarket/delete/depenses';
  private urifiltredepense = "/v1/sudmarket/filtre/depenses"

  // Categorie
  private uricategoriecreate = '/v1/sudmarket/create/categorie';
  private urigetcategorie = '/v1/sudmarket/get/categorie';
  private uriupdatecategorie = "/v1/sudmarket/update/categorie"

  private urigetdepensebypointdevente = "/v1/sudmarket/filtre/depenses/pointdevente"

  // Sous Categorie
  private urisouscategoriecreate = '/v1/sudmarket/create/sous_categorie';
  private urigetsouscategorie = '/v1/sudmarket/get/sous_categorie';
  private uriupdatesouscategorie = "/v1/sudmarket/update/sous_categorie"
  private urifiltresouscategoriebycategorie = "/v1/sudmarket/filtre/sous_categorie-by-categorie"

  constructor(private httpclient: HttpClient) {}

  // Créer une dépense
  createDepense(depense: Depense): Observable<CodeResponseDepense> {
    return this.httpclient.post<CodeResponseDepense>(
      environment.apiUrl + this.uricreatedepense,
      depense
    );
  }

  // Récupérer toutes les dépenses
  getListDepenses(depense: GetDepense): Observable<CodeResponseDepense> {
    return this.httpclient.post<CodeResponseDepense>(
      environment.apiUrl + this.urigetdepenses,
      depense
    );
  }

  // Récupérer une dépense par ID
  getOneDepense(depense: GetDepense): Observable<CodeResponseOneDepense> {
    return this.httpclient.post<CodeResponseOneDepense>(
      environment.apiUrl + this.urigetdepenses,
      depense
    );
  }

  // Mettre à jour une dépense
  updateDepense(depense: Depense): Observable<CodeResponseDepense> {
    return this.httpclient.post<CodeResponseDepense>(
      environment.apiUrl + this.uriupdatedepense,
      depense
    );
  }

  // Supprimer une dépense
  deleteDepense(depenseId: number): Observable<CodeResponseDepense> {
    const data = { depense_id: depenseId };
    return this.httpclient.post<CodeResponseDepense>(
      environment.apiUrl + this.urideletedepense,
      data
    );
  }

  getFilteredDepenses(data: any){
    return this.httpclient.post<any>(
      environment.apiUrl + this.urifiltredepense,
      data
    );
  }

   getFilteredDepensesBypointDeVente(point_de_vente_id: any){
    const data = {point_de_vente_id: point_de_vente_id}
    return this.httpclient.post<any>(
      environment.apiUrl + this.urigetdepensebypointdevente,
      data
    );
  }

  // Categories dépenses

  getListCategoriesDepenses(categorie: number) {
    const data = { id_categorie: categorie };
    return this.httpclient.post<any>(
      environment.apiUrl + this.urigetcategorie,
      data
    );
  }

  createCategorieDepense(categorie: any): Observable<any> {
    return this.httpclient.post<any>(
      environment.apiUrl + this.uricategoriecreate,
      categorie
    );
  }

  updateCategorieDepense(categorie: any): Observable<any> {
    return this.httpclient.post<CodeResponseDepense>(
      environment.apiUrl + this.uriupdatecategorie,
      categorie
    );
  }

  // Sous categorie

  getListSousCategoriesDepenses(id_sous_categorie: number) {
    const data = { id_sous_categorie: id_sous_categorie };
    return this.httpclient.post<any>(
      environment.apiUrl + this.urigetsouscategorie,
      data
    );
  }

  createSousCategorieDepense(souscategorie: any): Observable<any> {
    return this.httpclient.post<any>(
      environment.apiUrl + this.urisouscategoriecreate,
      souscategorie
    );
  }

  updateSousCategorieDepense(souscategorie: any): Observable<any> {
    return this.httpclient.post<CodeResponseDepense>(
      environment.apiUrl + this.uriupdatesouscategorie,
      souscategorie
    );
  }

    filtreSousCategorieByCategorieId(id_categorie: number): Observable<any> {
      const data = {id_categorie: id_categorie}
    return this.httpclient.post<any>(
      environment.apiUrl + this.urifiltresouscategoriebycategorie,
      data
    );
  }

}
