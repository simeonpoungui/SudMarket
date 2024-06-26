import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Login } from '../Models/login.model';
import { LoginService } from '../Services/login.service';
import { Router } from '@angular/router';
import { GlobalService } from '../Services/global.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private loginService: LoginService,
    private router : Router,
    private globalService: GlobalService
  ){}

  email!: string
  mot_de_passe_hash!: string
  message!: string

  onSubmitForm(form: NgForm){
    const login : Login = form.value
    console.log(login);
    this.loginService.login(login).subscribe(data => {
      console.log(data);
      if (data.code === 'succes') {
        this.message = data.message;
        this.globalService.toastShow(this.message,'Attention','success')
        console.log(this.message);
        localStorage.setItem('user', JSON.stringify(data.details));  
        this.router.navigateByUrl('/');
        window.location.reload();
      } else {
        this.message = data.message;
        this.globalService.toastShow(this.message,'Attention','info')
      }
    })
  }
}
