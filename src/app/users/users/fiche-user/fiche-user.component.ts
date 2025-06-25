import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/Services/users.service';
import { GlobalService } from 'src/app/Services/global.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-fiche-user',
  templateUrl: './fiche-user.component.html',
  styleUrls: ['./fiche-user.component.scss']
})
export class FicheUserComponent {

  @Input() action!:string;
  user!: Utilisateur;
  message!: any
  tbPointdeVente: PointsDeVentes[] = []

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private pointService: PointsDeVentesService,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private userService: UsersService
  ){}

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
  image: any | ArrayBuffer | null = null;
  

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action']
    console.log(this.action);
    const utilisateurJson = localStorage.getItem('selectedUtilisateur');
    if (utilisateurJson) {
      this.user =  JSON.parse(utilisateurJson);
    }
    this.loadPointDeVente()
    this.getImageUserID()
  }

  getImageUserID(){
    const user: GetUser = {utilisateur_id: this.user.utilisateur_id}
    this.userService.getImageByUser(user).subscribe(data => {
      console.log(data.message);
      this.image = data.message
    })
  }

  goBack() {
  this.location.back();
}
  
  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
    }
  )
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
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
          this.message = data.message
          this.router.navigateByUrl('/user/list')
          this.globalService.toastShow(this.message,'Succès','success')
        } )
      }
    })
  }
}
