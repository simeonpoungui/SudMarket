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

  isPasswordVisible = false;

  constructor(
    private loginService: LoginService,
    private router : Router,
    private globalService: GlobalService
  ){}

  email!: string
  mot_de_passe_hash!: string
  message!: string
  isloading!: boolean

  onSubmitForm(form: NgForm){
    const login : Login = form.value
    console.log(login);
    this.isloading = true
    this.loginService.login(login).subscribe(data => {
      console.log(data);
      if (data.code === 'succes') {
        this.message = data.message;
        this.globalService.toastShow(this.message,'Attention','success')
        console.log(this.message);
        localStorage.setItem('user', JSON.stringify(data.details));  
        this.router.navigateByUrl('/');
        window.location.reload();
        this.isloading = false
      } else {
        this.message = data.message;
        this.globalService.toastShow(this.message,'Attention','info')
        this.isloading = false
      }
    })
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // onSubmitForm(form: NgForm){
  //   const login : Login = form.value
  //   this.isloading = true
  //   console.log(login);
  //   this.loginService.login(login).subscribe(
  //     data => {
  //       console.log(data);
  //       if (data.code === 'succes') {
  //         this.isloading = false
  //         localStorage.setItem('token', JSON.stringify({ token: data.token }));
  //         const dialog = this.dialog.open(AskTokenComponent);
  //         dialog.componentInstance.utilisateur_id = data.utilisateur_id;
  //       } else {
  //         this.message = data.message;
  //         this.globalService.toastShow(data.message, 'Attention', 'info');
  //       }
  //     },
  //     error => {
  //       console.error('Erreur lors de l\'appel API:', error);
  //       this.globalService.toastShow('Une erreur est survenue lors de l\'appel à l\'API.', 'Erreur', 'error');
  //     }
  //   );
    
  // }
}
