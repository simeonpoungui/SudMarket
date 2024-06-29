import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environnement/environnement.prod';
import { ArticlesDeVentes, CodeResponse, CodeResponseOneArticle, GetArticleDeVente } from '../Models/articlesDeVente.model';
import { GetProduit } from '../Models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ArticlesDeVenteService {

  urigetlistarticlesVentes = "/v1/sudmarket/get/articlesVentes"
  uricreatearticlesVentes = "/v1/sudmarket/create/articlesVentes"
  urideletearticlesVentes = "/v1/sudmarket/delete/articlesVentes"
  uriupdatearticlesVentes = "/v1/sudmarket/update/articlesVentes"

  urigefiltresarticlesVentes = "/v1/sudmarket/get/filtres/articlesVentes"
  urigetfiltresbydatearticlesdeventes = "/v1/sudmarket/get/filtres/by-dates/articlesVentes"

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

  //Filtres
  getArticlesDeVentesByProduit(produit: GetProduit): Observable<CodeResponseOneArticle>{
    return this.httpclient.post<CodeResponseOneArticle>(environment.apiUrl + this.urigefiltresarticlesVentes, produit)
  }

  getArticlesDeVentesByDateDebutFin(DateDebutVente: String, dateFinVente: string): Observable<CodeResponseOneArticle>{
    const data = {
      DateDebutVente: DateDebutVente,
      dateFinVente: dateFinVente
    }
    console.log(data);
    
    return this.httpclient.post<CodeResponseOneArticle>(environment.apiUrl + this.urigetfiltresbydatearticlesdeventes, data)
  }

}
