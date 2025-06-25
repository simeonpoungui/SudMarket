import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { NgForm } from '@angular/forms';
import { Boutique, GetBoutique } from 'src/app/Models/boutique.model';
import { BoutiqueService } from 'src/app/Services/boutique.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-fiche-point-de-vente-form',
  templateUrl: './fiche-point-de-vente-form.component.html',
  styleUrls: ['./fiche-point-de-vente-form.component.scss']
})
export class FichePointDeVenteFormComponent {
  action!: string;
  message!: any
  point!: PointsDeVentes
  point_de_vente_id!: number;
  nom!: string;
  adresse!: string;
  ville!: string;
  code_postal!: string;
  pays!: string;
  boutique_id?: number
  telephone!: string;
  email!: string;
  responsable!: string;
  date_creation!: string;
  date_modification!: string;

  tbBoutique!: Boutique[]

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private boutiService: BoutiqueService,
    private pointService: PointsDeVentesService
  ){}

  isFormValid(): any {
    return this.nom && this.email && this.telephone && this.responsable && this.adresse;
  }
  ngOnInit(): void {
    this.action = this.route.snapshot.params['action']
    console.log(this.action);
    const pointtJSON = localStorage.getItem('selectedPointVente');
    if (pointtJSON) {
      this.point =  JSON.parse(pointtJSON);
      console.log(this.point);
    }

    if (this.action == 'edit') {
      this.initFomForPoint()
    }
    this.loadBoutique()
  }

  loadBoutique(){
    const boutique: GetBoutique = {
      boutique_id: 0
    }
    this.boutiService.getList(boutique).subscribe(data  => {
      console.log(data.message);
      this.tbBoutique = data.message
    } 
  )
  }

      goBack() {
  this.location.back();
}

  initFomForPoint(){
    this.point_de_vente_id = this.point.point_de_vente_id
    this.nom = this.point.nom
    this.adresse = this.point.adresse
    this.ville = this.point.ville
    this.code_postal = this.point.code_postal
    this.pays = this.point.pays
    this.telephone = this.point.telephone
    this.email = this.point.email
    this.responsable = this.point.responsable
    this.boutique_id = this.point.boutique_id
  }
  //Submit form point
  onSubmitForm(form: NgForm){
    const point: PointsDeVentes = form.value;
    console.log(point);
    
    if (this.action === 'edit') {
      point.point_de_vente_id = this.point.point_de_vente_id
      this.pointService.update(point).subscribe(data => {
        console.log(data);
        this.message = data.message
        this.router.navigateByUrl('points-de-ventes')
        this.globalService.toastShow(this.message,'Succès','success')
      })
    }else{
      console.log(point);
      this.pointService.create(point).subscribe(data => {
        console.log(data);
        this.message = data.message
        this.router.navigateByUrl('points-de-ventes')
        this.globalService.toastShow(this.message,'Succès','success')
      })
    }
  }
}
