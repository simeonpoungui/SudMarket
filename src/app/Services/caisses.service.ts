import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environnement/environnement.prod';
import {
  CaissesVendeur,
  CodeResponse,
  CodeResponseOneCaisseV,
  GetCaisseVendeur,
} from '../Models/caissevendeur.model';
import { GetUser } from '../Models/users.model';
import {
  CodeResponseHistorique,
  HistoriqueCaisseVendeur,
} from '../Models/historiqueCaisseVendeur.model';

@Injectable({
  providedIn: 'root',
})
export class CaissesService {
  constructor(private httpclient: HttpClient) {}

  urigetcaissebyuser = '/v1/sudmarket/get/caisse/by-user';
  infocaissejournneecomptable ='/v1/sudmarket/get/info-caisse/journee-comptable';
  cloturejourneecomptable = '/v1/sudmarket/cloture/journee/comptable';
  urihisttoriquecaissevendeur = '/v1/sudmarket/get/historique/caisses/vendeur';
  urigetcaisselist = '/v1/sudmarket/get/caisse/vendeurs';
  urisoldehistoriquecaissebydatecomptable ='/v1/sudmarket/get/solde/caisse-by-date-comptable';
  uricreatecaissevendeur = "/v1/sudmarket/create/caisse/vendeur"
  uriupadtecaissevendeur = "/v1/sudmarket/update/caisse/vendeur"
  urideletecaissevendeur = "/v1/sudmarket/delete/caisse/vendeur"
  urigethistoriquesoldecaissesvendeurs = "/v1/sudmarket/get/solde/caisses/vendeurs"
  uribordereaudescaissescreate = "/v1/sudmarket/bordereau/des/caisses"
  
  //Partie A caisse vendeur

  getListCaisseVendeur(caisse: GetCaisseVendeur): Observable<CodeResponse> {
    return this.httpclient.post<any>(environment.apiUrl + this.urigetcaisselist,caisse);
  }

  deleteCaisseVendeur(caisse: CaissesVendeur){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urideletecaissevendeur, caisse)
  }

  updateCaisseVendeur(caisse: CaissesVendeur){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupadtecaissevendeur, caisse)
  }
  
  createCaisseVendeur(caisse: CaissesVendeur){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreatecaissevendeur, caisse)
  }

  getCaisseByUser(user: GetUser): Observable<CodeResponseOneCaisseV> {
    return this.httpclient.post<any>(
      environment.apiUrl + this.urigetcaissebyuser,
      user
    );
  }

  gethistoriqueCaisseVendeur(
    user: GetUser
  ): Observable<CodeResponseOneCaisseV> {
    return this.httpclient.post<any>(
      environment.apiUrl + this.urigetcaissebyuser,
      user
    );
  }

  //Partie B Solde caisse by journée comptable

  clotureJourneeComptable(vendeur: any) {
    console.log(vendeur);
    return this.httpclient.post<any>(environment.apiUrl + this.cloturejourneecomptable,vendeur);
  }

  getinfocaisseJourneeComptable(
    caisse_vendeur_id: number,
    date_comptable: Date
  ): Observable<CodeResponseHistorique> {
    const data = {
      caisse_vendeur_id: caisse_vendeur_id,
      date_comptable: date_comptable,
    };
    console.log(data);
    return this.httpclient.post<any>(
      environment.apiUrl + this.infocaissejournneecomptable,
      data
    );
  }

  getSoldeCaisseByDateComptable(IDcaisse: number,date_comptable: Date){
    const data = {
      caisse_vendeur_id:IDcaisse,
      date_comptable: date_comptable,
    };
    console.log(data);
    return this.httpclient.post<any>(
      environment.apiUrl + this.urisoldehistoriquecaissebydatecomptable,
      data
    );
  }

  //Partie C Historique des caisses vendeurs

  getHistoriqueCaisseVendeurByPlageDate(
    caisse_vendeur_id: number,
    DateDebut: string,
    DateFin: string
  ): Observable<CodeResponse> {
    const data = {
      caisse_vendeur_id: caisse_vendeur_id,
      dateDebut: DateDebut,
      dateFin: DateFin,
    };
    console.log(data);
    return this.httpclient.post<any>(
      environment.apiUrl + this.urihisttoriquecaissevendeur,
      data
    );
  }

  getListSoldeFermetureCaisseVendeur(solde: any) {
    console.log(solde);
    return this.httpclient.post<any>(environment.apiUrl + this.urigethistoriquesoldecaissesvendeurs,solde);
  }

  //Bordereau des caisses
  createBordereauDesCaisse(bordereau: any){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uribordereaudescaissescreate, bordereau)
  }
}
