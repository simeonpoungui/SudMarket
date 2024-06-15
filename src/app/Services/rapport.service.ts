import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse, CodeResponseOneRapport, GetRapport, Rapport } from '../Models/rapport.model';

@Injectable({
  providedIn: 'root'
})
export class RapportService {

  uriget = ""
  uricreate = ""
  uridelete = ""
  uriupdate = ""

  constructor(private httpclient: HttpClient) { }

  getList(rapport: GetRapport): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriget, rapport)
  }
  getOne(rapport: GetRapport): Observable<CodeResponseOneRapport>{
    return this.httpclient.post<CodeResponseOneRapport>(environment.apiUrl + this.uriget, rapport)
  }
  delete(rapport: Rapport){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uridelete, rapport)
  }
  update(rapport: Rapport){
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdate, rapport)
  }
  create(rapport: Rapport){
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreate, rapport)
  }
}
