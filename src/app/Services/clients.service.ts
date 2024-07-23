import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environnement/environnement.prod';
import { Client, GetClient,CodeResponse,CodeResponseOneClient} from '../Models/clients.model';
import { ArticlesDeCommandeDAchat } from '../Models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  urigetlistclient = "/v1/sudmarket/get/clients"
  uricreateclient = "/v1/sudmarket/create/clients"
  urideleteclient = "/v1/sudmarket/delete/clients"
  uriupdateclient = "/v1/sudmarket/update/clients"
  produitsachatsbyclients = "/v1/sudmarket/get/produits-achetes-by-client"
  uriimpressionetatclient = "/v1/sudmarket/impression/clients"
  uriimprimearticleachetesbyclient = "/v1/sudmarket/impression/historique/articles/achats/client"

  constructor(private httpclient: HttpClient) { }

  getListClient(user: GetClient): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urigetlistclient, user)
  }
  getOneClient(user: GetClient): Observable<CodeResponseOneClient>{
    return this.httpclient.post<CodeResponseOneClient>(environment.apiUrl + this.urigetlistclient, user)
  }
  deleteClient(user: Client){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urideleteclient, user)
  }
  updateClient(user: Client){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdateclient, user)
  }
  createClient(user: Client){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreateclient, user)
  }

  getListProduitAchetesByClient(client: GetClient){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.produitsachatsbyclients, client)
  }


  getListClientPDF(): Observable<any> {
    console.log(environment.apiUrl + this.uriimpressionetatclient);
    return this.httpclient.get(environment.apiUrl + this.uriimpressionetatclient, {
      responseType: 'blob' as 'json'
    });
  }

  getHistoriqueAchetesByClient(data: ArticlesDeCommandeDAchat[]): Observable<any> {
    console.log(environment.apiUrl + this.uriimpressionetatclient);
    return this.httpclient.post(environment.apiUrl + this.uriimprimearticleachetesbyclient, data, {
      responseType: 'blob' as 'json'
    });
  }

}
