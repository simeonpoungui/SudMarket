import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import {
  CodeResponse,
  CodeResponseOneCommandeAchat,
  CommandeAchat,
  GetCommandeAchat,
} from '../Models/commande.model';

@Injectable({
  providedIn: 'root',
})
export class CommandeService {
  uriget = '/v1/sudmarket/get/commandes-achats';
  uricreate = '/v1/sudmarket/create/commandes-achats';
  uridelete = '/v1/sudmarket/delete/commandes-achats';
  uriupdate = '/v1/sudmarket/update/commandes-achats';
  urifiltrescommandes = '/v1/sudmarket/get/filtre/commandes/achats';
  uriimprimecommandesachats = "/v1/sudmarket/impression/commandes/achats"

  constructor(private httpclient: HttpClient) {}

  getList(commande: GetCommandeAchat): Observable<CodeResponse> {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uriget,
      commande
    );
  }
  getOne(commande: GetCommandeAchat): Observable<CodeResponseOneCommandeAchat> {
    return this.httpclient.post<CodeResponseOneCommandeAchat>(
      environment.apiUrl + this.uriget,
      commande
    );
  }
  delete(commande: CommandeAchat) {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uridelete,
      commande
    );
  }
  update(commande: CommandeAchat) {
    return this.httpclient.put<CodeResponse>(
      environment.apiUrl + this.uriupdate,
      commande
    );
  }
  create(commande: CommandeAchat) {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uricreate,
      commande
    );
  }

  getListFiltreCommandes(
    IDfournisseur: number,
    IDuser: number,
    IDpointVente: number,
    DateDebut: string,
    DateFin: string
  ) {
    const data = {
      fournisseur_id: IDfournisseur,
      utilisateur_id: IDuser,
      point_de_vente_id: IDpointVente,
      DateDebut: DateDebut,
      DateFin: DateFin,
    };
    console.log(data);
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.urifiltrescommandes,
      data
    );
  }


  getListCommandesPDF(data: CommandeAchat[]): Observable<any> {
    console.log(environment.apiUrl + this.uriimprimecommandesachats);
    return this.httpclient.post(environment.apiUrl + this.uriimprimecommandesachats, data , {
      responseType: 'blob' as 'json'
    });
  }
}
