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
  urisoldehistoriquecaissebydatecomptable = "/v1/sudmarket/get/solde/caisse-by-date-comptable"

  getListCaisseVendeur(caisse: GetCaisseVendeur): Observable<CodeResponse> {
    console.log(caisse);
    return this.httpclient.post<any>(
      environment.apiUrl + this.urigetcaisselist,
      caisse
    );
  }

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

  clotureJourneeComptable(vendeur: any) {
    console.log(vendeur);
    return this.httpclient.post<any>(
      environment.apiUrl + this.cloturejourneecomptable,
      vendeur
    );
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

  getSoldeCaisseByDateComptable(
    date_comptable: Date
  ): Observable<CodeResponseHistorique> {
    const data = {
      date_comptable: date_comptable,
    };
    console.log(data);
    return this.httpclient.post<any>(
      environment.apiUrl + this.urisoldehistoriquecaissebydatecomptable,
      data
    );
  }
}
