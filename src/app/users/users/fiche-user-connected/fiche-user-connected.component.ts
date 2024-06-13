import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilisateur } from 'src/app/Models/users.model';
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
  image: string = "assets/images/avatar/3.png"
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
  }
  updateUser(){
    this.router.navigateByUrl('/user/edit')
  }

}
