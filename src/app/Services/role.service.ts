import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponse, GetRole } from '../Models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  urigetroles = "/v1/sudmarket/get/roles"
  constructor(
    private httpclient: HttpClient
  ) { }

  getListRole(role: GetRole): Observable<CodeResponse>{
    return this.httpclient.post<CodeResponse>(environment.apiUrl + this.urigetroles, role)
  }

}
