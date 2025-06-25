import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse, CodeResponseOneRapport, GetRapport, Rapport } from '../Models/rapport.model';

@Injectable({
  providedIn: 'root'
})
export class RapportService {

  uriget = "/v1/sudmarket/get/rapports"
  uricreate = "/v1/sudmarket/create/rapports"
  uridelete = "/v1/sudmarket/delete/rapports"
  uriupdate = "/v1/sudmarket/update/rapports"

  urigeneraterapport = "/v1/sudmarket/rapport/autmatise"

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

  generateReport(reportData: any): Observable<any> {
    console.log(reportData);
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urigeneraterapport, reportData)
  }
}
