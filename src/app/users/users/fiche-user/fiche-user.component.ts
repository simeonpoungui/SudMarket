import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilisateur } from 'src/app/Models/users.model';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/Services/users.service';
@Component({
  selector: 'app-fiche-user',
  templateUrl: './fiche-user.component.html',
  styleUrls: ['./fiche-user.component.scss']
})
export class FicheUserComponent {

  @Input() action!:string;
  user!: Utilisateur;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private userService: UsersService
  ){}

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action']
    console.log(this.action);
    const utilisateurJson = localStorage.getItem('selectedUtilisateur');
    if (utilisateurJson) {
      this.user =  JSON.parse(utilisateurJson);
    }
  }
  updateUser(){
    this.router.navigateByUrl('/user/edit')
  }
  //delete user for BD
  deleteuser(){
    const alert = this.dialog.open(AlertComponent)
    alert.componentInstance.content = "Voulez-vous supprimé l'utilisateur " + this.user.nom_utilisateur + ' ?'
    alert.componentInstance.backgroundColor = "danger"
    alert.afterClosed().subscribe(confirmDelete => {
      if (confirmDelete) {
        console.log(this.user);
        this.userService.deleteUser(this.user).subscribe(data => {
          console.log(data.message);
          this.router.navigateByUrl('/user/list')
        } )
      }
      
    })
  }
}
