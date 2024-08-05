import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CaisseVendeur } from 'src/app/Models/historiqueCaisseVendeur.model';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { GlobalService } from 'src/app/Services/global.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-fiche',
  templateUrl: './fiche.component.html',
  styleUrls: ['./fiche.component.scss']
})
export class FicheComponent {

  action: string = 'view'
  caisse!: CaisseVendeur ;
  tbPointdeVente!: PointsDeVentes[];
  tbUsers!: Utilisateur[]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService,
    public globalService: GlobalService,
    private pointService: PointsDeVentesService,
  ){}
  
  ngOnInit(): void {
    console.log(this.action);
    const CaisseSON = localStorage.getItem('selectedCaisseVendeur');
    if (CaisseSON) {
      this.caisse =  JSON.parse(CaisseSON);
      console.log(this.caisse);
    }
    this.loadUser()
    this.loadPointDeVente();

  }

  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
      console.log(this.tbPointdeVente);
    } )
  }

  loadUser() {
    const user: GetUser = { utilisateur_id: 0 };
    this.userService.getListUser(user).subscribe((data) => {
      console.log(data.message);
      this.tbUsers = data.message;
    });
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
  }

  getUserName(utilisateur_id: any): string {
    const user = this.tbUsers.find(
      (u) => u.utilisateur_id === utilisateur_id
    );
    return user ? user.nom_utilisateur : 'Unknown User';
  }

  updateCaisse(){
    this.router.navigateByUrl('/caisse-vendeur-form/edit')
  }

}
