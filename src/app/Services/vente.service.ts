import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse, CodeResponseOneVente, GetVente, Vente } from '../Models/vente.model';
import { Utilisateur } from '../Models/users.model';
import { Client } from '../Models/clients.model';
import { PointsDeVentes } from '../Models/pointsDeVentes.model';
import { ArticlesDeVentes, GetArticleDeVente } from '../Models/articlesDeVente.model';

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  uriget = "/v1/sudmarket/get/ventes"
  uricreate = "/v1/sudmarket/create/ventes"
  uridelete = "/v1/sudmarket/delete/ventes"
  uriupdate = "/v1/sudmarket/update/ventes"
  urigetventefiltre = "/v1/sudmarket/get/produit-by-client-user-point-date"
  uriimpressionetatventes = "/v1/sudmarket/impression/rapports/ventes"
  urigetarticledeventebyventeid = "/v1/sudmarket/get/filtre/articles-de-vente-by-venteID"
  urigetventejournalierebyuser = "/v1/sudmarket/get/vente/user/journaliere"
  uriarticleventejournalierebyuser = "/v1/sudmarket/get/article/vente/user/journaliere"

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

  getVenteJournaliereByUser(utilisateur_id: number, date_comptable: string){
    const data = {
      utilisateur_id: utilisateur_id,
      date_vente : date_comptable
    }
    console.log(data);
    return this.httpclient.post<any>(environment.apiUrl + this.urigetventejournalierebyuser, data)
  }

  getArticleVenteJournaliereByUser(date_article_vendu: string){
    const data = {
      date_article_vendu : date_article_vendu
    }
    console.log(data);
    return this.httpclient.post<any>(environment.apiUrl + this.uriarticleventejournalierebyuser, data)
  }

  getArticleDeVenteByVente(vente: GetVente){
    console.log(vente);
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urigetarticledeventebyventeid, vente)
  }

  getListVenteByParametre(client: number, user: number,  point: number, DateDebut: string, DateFin: string){
    const data = {
      client_id: client,
      utilisateur_id: user,
      point_de_vente_id: point,
      dateDebutVente:DateDebut,
      dateFinVente:DateFin
    }
    console.log(data);
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urigetventefiltre, data)
  }

  getListVenteEtatPDF(data: Vente[]): Observable<any> {
    console.log(data);
    console.log(environment.apiUrl + this.uriimpressionetatventes);
    return this.httpclient.post(environment.apiUrl + this.uriimpressionetatventes, data, {
      responseType: 'blob' as 'json'
    });
  }
}
