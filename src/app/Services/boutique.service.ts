import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponseBoutique, CodeResponseOneBoutique, Boutique, GetBoutique } from '../Models/boutique.model';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {

  uriget = "/v1/sudmarket/get/boutiques"
  uricreate = "/v1/sudmarket/create/boutiques"
  uridelete = "/v1/sudmarket/delete/boutiques"
  uriupdate = "/v1/sudmarket/update/boutiques"

  constructor(private httpclient: HttpClient) { }

  getList(boutique: GetBoutique): Observable<CodeResponseBoutique> {
    return this.httpclient.post<CodeResponseBoutique>(environment.apiUrl + this.uriget, boutique);
  }

  getOne(boutique: GetBoutique): Observable<CodeResponseOneBoutique> {
    return this.httpclient.post<CodeResponseOneBoutique>(environment.apiUrl + this.uriget, boutique);
  }

  delete(boutique: Boutique): Observable<CodeResponseBoutique> {
    return this.httpclient.post<CodeResponseBoutique>(environment.apiUrl + this.uridelete, boutique);
  }

  update(boutique: Boutique): Observable<CodeResponseBoutique> {
    return this.httpclient.put<CodeResponseBoutique>(environment.apiUrl + this.uriupdate, boutique);
  }

  create(boutique: Boutique): Observable<CodeResponseBoutique> {
    return this.httpclient.post<CodeResponseBoutique>(environment.apiUrl + this.uricreate, boutique);
  }
}
