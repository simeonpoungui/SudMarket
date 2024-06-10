import { Component } from '@angular/core';
import { LoginService } from '../Services/login.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private loginService : LoginService){}

  onLogout(){
    this.loginService.logout()
  }

}