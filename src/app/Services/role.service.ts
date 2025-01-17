import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse, GetRole, Role } from '../Models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  urigetroles = "/v1/sudmarket/get/roles"
  urideleterole = "/v1/sudmarket/delete/roles"
  uriupdaterole = "/v1/sudmarket/update/roles"
  uricreaterole = "/v1/sudmarket/create/roles"


  constructor(
    private httpclient: HttpClient
  ) { }

  getListRole(role: GetRole): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urigetroles, role)
  }

  deleteRole(role: Role): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urideleterole, role)
  }

  updateRole(role: Role): Observable<CodeResponse>{
    return this.httpclient.put<CodeResponse>(environment.apiUrl + this.uriupdaterole, role)
  }

 createRole(role: Role): Observable<any>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.uricreaterole, role)
  }

}
