import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/Services/users.service';
@Component({
  selector: 'app-fiche-user-connected',
  templateUrl: './fiche-user-connected.component.html',
  styleUrls: ['./fiche-user-connected.component.scss']
})
export class FicheUserConnectedComponent {
  @Input() action!:string;
  user!: Utilisateur;
  imageUserConnected!: Utilisateur[]
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private userService: UsersService
  ){}

  ngOnInit(): void {
    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user =  JSON.parse(utilisateurJson);
    }
    this.getImageUserID()
  }
  updateUser(){
    this.router.navigateByUrl('/user/edit')
  }

  getImageUserID(){
    const user: GetUser = {utilisateur_id: this.user.utilisateur_id}
    this.userService.getImageByUser(user).subscribe(data => {
      this.imageUserConnected = data.message
      console.log(this.imageUserConnected);
    })

}
}
