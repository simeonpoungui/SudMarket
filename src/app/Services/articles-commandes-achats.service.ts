import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environnement/environnement.prod';
import { ArticlesDeCommandeDAchat,CodeResponse,GetArticleDeCommandeDAchat } from '../Models/articles.commandes.achats';

@Injectable({
  providedIn: 'root'
})
export class ArticlesCommandesAchatsService {

  uriget = "/v1/sudmarket/get/articles-commandes-achats"
  uricreate = "/v1/sudmarket/create/articles-commandes-achats"
  uridelete = "/v1/sudmarket/delete/articles-commandes-achats"
  uriupdate = "/v1/sudmarket/update/articles-commandes-achats"
  uriimprimearticlecommandesachats = "/v1/sudmarket/impression/commandes/article"
  urifiltresarticlescommandes = "/v1/sudmarket/get/filtre/articles/commandes"

  constructor(private httpclient: HttpClient) { }

  getList(article: GetArticleDeCommandeDAchat): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriget, article)
  }

  getOne(article: GetArticleDeCommandeDAchat): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriget, article)
  }

  delete(article: ArticlesDeCommandeDAchat){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uridelete, article)
  }

  update(article: ArticlesDeCommandeDAchat){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdate, article)
  }
  
  create(article: ArticlesDeCommandeDAchat){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreate, article)
  }

  getListCommandesPDF(data: ArticlesDeCommandeDAchat[]): Observable<any> {
    console.log(environment.apiUrl + this.uriimprimearticlecommandesachats);
    return this.httpclient.post(environment.apiUrl + this.uriimprimearticlecommandesachats, data , {
      responseType: 'blob' as 'json'
    });
  }

  getListFiltreArticlesCommandes(
    IDproduit: number,
    IDpoint: number,
    DateDebutCommande: string,
    DateFinCommande: string
  ) {
    const data = {
      produit_id: IDproduit,
      point_de_vente_id: IDpoint,
      DateDebutCommande: DateDebutCommande,
      DateFinCommande: DateFinCommande,
    };
    console.log(data);
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.urifiltresarticlescommandes,
      data
    );
  }

}
