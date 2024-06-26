import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse, CodeResponseOneCommandeAchat, CommandeAchat, GetCommandeAchat } from '../Models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  uriget = "/v1/sudmarket/get/commandes-achats"
  uricreate = "/v1/sudmarket/create/commandes-achats"
  uridelete = "/v1/sudmarket/delete/commandes-achats"
  uriupdate = "/v1/sudmarket/update/commandes-achats"

  constructor(private httpclient: HttpClient) { }

  getList(commande: GetCommandeAchat): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriget, commande)
  }
  getOne(commande: GetCommandeAchat): Observable<CodeResponseOneCommandeAchat>{
    return this.httpclient.post<CodeResponseOneCommandeAchat>(environment.apiUrl + this.uriget, commande)
  }
  delete(commande: CommandeAchat){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uridelete, commande)
  }
  update(commande: CommandeAchat){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdate, commande)
  }
  create(commande: CommandeAchat){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreate, commande)
  }
}
