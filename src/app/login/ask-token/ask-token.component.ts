import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-ask-token',
  templateUrl: './ask-token.component.html',
  styleUrls: ['./ask-token.component.scss'],
})
export class AskTokenComponent {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private globalService: GlobalService
  ) {}

  token!: string;
  utilisateur_id!: number;
  isloading: boolean = false

  SendToken() {
    const token = {
      token: this.token,
      utilisateur_id: this.utilisateur_id
      };
    console.log(token);
    this.isloading = true
    this.loginService.VerifyToken(token).subscribe((data) => {
      console.log(data);
      if ((data.code == 'succes')) {
        this.isloading = false
        localStorage.setItem('user', JSON.stringify(data.utilisateur));
        this.router.navigateByUrl('/');
        window.location.reload();
        this.globalService.toastShow(data.message, 'Succès');
      }else{
        this.isloading = false
        this.globalService.toastShow(data.message, 'Attention','info');
      }
    });
  }
}
