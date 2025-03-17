import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environnement/environnement.prod'; 
import { Depense, GetDepense, CodeResponseDepense, CodeResponseOneDepense } from '../Models/depenses.model';

@Injectable({
  providedIn: 'root'
})
export class DepensesService {

  // L'URL de base pour l'API de gestion des dépenses
  private uricreatedepense = '/v1/sudmarket/create/depenses';
  private urigetdepenses = '/v1/sudmarket/get/depenses';
  private uriupdatedepense = '/v1/sudmarket/update/depenses';
  private urideletedepense = '/v1/sudmarket/delete/depenses';

  constructor(private httpclient: HttpClient) { }

  // Créer une dépense
  createDepense(depense: Depense): Observable<CodeResponseDepense> {
    return this.httpclient.post<CodeResponseDepense>(environment.apiUrl + this.uricreatedepense, depense);
  }

  // Récupérer toutes les dépenses
  getListDepenses(depense: GetDepense): Observable<CodeResponseDepense> {
    return this.httpclient.post<CodeResponseDepense>(environment.apiUrl + this.urigetdepenses, depense);
  }

  // Récupérer une dépense par ID
  getOneDepense(depense: GetDepense): Observable<CodeResponseOneDepense> {
    return this.httpclient.post<CodeResponseOneDepense>(environment.apiUrl + this.urigetdepenses, depense);
  }

  // Mettre à jour une dépense
  updateDepense(depense: Depense): Observable<CodeResponseDepense> {
    return this.httpclient.post<CodeResponseDepense>(environment.apiUrl + this.uriupdatedepense, depense);
  }

  // Supprimer une dépense
  deleteDepense(depenseId: number): Observable<CodeResponseDepense> {
    const data = { depense_id: depenseId };
    return this.httpclient.post<CodeResponseDepense>(environment.apiUrl + this.urideletedepense, data);
  }
}
