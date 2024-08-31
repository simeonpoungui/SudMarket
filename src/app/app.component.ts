import { Component } from '@angular/core';
import { LoginService } from './Services/login.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sud-market';
  isLogin: boolean = false;
  user: any

  constructor(
    private loginServoce: LoginService,
    private dialog: MatDialog
  ){}
  
  ngOnInit() {
    const user = localStorage.getItem("user");
    console.log(user);
    if(user){
      this.isLogin = true;
      this.user = JSON.parse(user);
      console.log(this.user)
    }
    // this.deconnexion.startLogoutTimer();
  }

  onLogout(){
    this.loginServoce.logout();
  }
}
