import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environnement/environnement.prod';
import { Session, CodeResponseOneSession, GetSession, CodeResponse  } from '../Models/session.ventes.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  uriGetSessions = "/v1/sudmarket/get/sessions";
  uriDeleteSession = "/v1/sudmarket/delete/sessions";
  uriUpdateSession = "/v1/sudmarket/update/sessions";
  uriCreateSession = "/v1/sudmarket/create/sessions";

  constructor(private httpclient: HttpClient) { }

  getListSessions(session: GetSession): Observable<CodeResponse> {
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriGetSessions, session);
  }

  deleteSession(session: Session): Observable<CodeResponse> {
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uriDeleteSession, session);
  }

  updateSession(session: Session): Observable<CodeResponse> {
    console.log(session);
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriUpdateSession, session);
  }

  createSession(session: Session): Observable<CodeResponseOneSession> {
    return this.httpclient.post<CodeResponseOneSession>(environment.apiUrl + this.uriCreateSession, session);
  }

}
