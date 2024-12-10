import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environnement/environnement.prod';
import { ArticlesDeVentes, CodeResponse, CodeResponseOneArticle, GetArticleDeVente } from '../Models/articlesDeVente.model';
import { GetProduit } from '../Models/produit.model';
import { PointsDeVentes } from '../Models/pointsDeVentes.model';

@Injectable({
  providedIn: 'root'
})
export class ArticlesDeVenteService {

  urigetlistarticlesVentes = "/v1/sudmarket/get/articlesVentes"
  uricreatearticlesVentes = "/v1/sudmarket/create/articlesVentes"
  urideletearticlesVentes = "/v1/sudmarket/delete/articlesVentes"
  uriupdatearticlesVentes = "/v1/sudmarket/update/articlesVentes"
  urigetfiltresbydatearticlesdeventes = "/v1/sudmarket/get/filtres/by-dates/articlesVentes"
  uriimpressionarticleventes ="/v1/sudmarket/impression/articles/ventes"
  produit_id: any;

  constructor(private httpclient: HttpClient) { }


  getList(articlevente: GetArticleDeVente): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urigetlistarticlesVentes, articlevente)
  }
  getOne(articlevente: GetArticleDeVente): Observable<CodeResponseOneArticle>{
    return this.httpclient.post<CodeResponseOneArticle>(environment.apiUrl + this.urigetlistarticlesVentes, articlevente)
  }
  delete(articlevente: ArticlesDeVentes){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urideletearticlesVentes, articlevente)
  }
  update(articlevente: ArticlesDeVentes){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdatearticlesVentes, articlevente)
  }
  create(articlevente: ArticlesDeVentes){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreatearticlesVentes, articlevente)
  }

  getArticlesDeVentesByDateDebutFin(IDproduit: number, IDpoint: number,  dateDebutVente: String, dateFinVente: string): Observable<CodeResponseOneArticle>{
    const data = {
      produit_id: IDproduit,
      point_de_vente_id: IDpoint,
      dateDebutVente: dateDebutVente,
      dateFinVente: dateFinVente
    }
    console.log(data);
    return this.httpclient.post<CodeResponseOneArticle>(environment.apiUrl + this.urigetfiltresbydatearticlesdeventes, data)
  }

  getListAticleDeVentesEtatPDF(data: ArticlesDeVentes[]): Observable<any> {
    console.log(data);
    console.log(environment.apiUrl + this.uriimpressionarticleventes);
    return this.httpclient.post(environment.apiUrl + this.uriimpressionarticleventes, data, {
      responseType: 'blob' as 'json'
    });
  }

}
