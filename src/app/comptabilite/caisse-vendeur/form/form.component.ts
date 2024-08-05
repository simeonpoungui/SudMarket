import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { CaisseVendeur } from 'src/app/Models/historiqueCaisseVendeur.model';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { ClientsService } from 'src/app/Services/clients.service';
import { GlobalService } from 'src/app/Services/global.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
    action!:string;

    caisse_vendeur_id!: number;
    nom_caisse!: string;
    point_de_vente_id!: number;
    utilisateur_id!: number;
    solde_caisse!: number;
    date_creation!: Date;
    date_mise_a_jour!: Date;
    actif!: boolean;
    caisse!: CaisseVendeur
    tbPointdeVente!: PointsDeVentes[]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pointService: PointsDeVentesService,
    private globaService: GlobalService,
    private clientService: ClientsService
  ){}

  isFormValid(): any {
    return this.nom_caisse && this.point_de_vente_id && this.utilisateur_id && this.solde_caisse;
  }

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action']
    console.log(this.action);
    const CaisseSON = localStorage.getItem('selectedCaisseVendeur');
    if (CaisseSON) {
      this.caisse =  JSON.parse(CaisseSON);
      console.log(this.caisse);
    }
    if (this.action === 'edit') {
      this.initFomForUser()
    }
    this.loadPointDeVente()
  }
  

  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
      
    } )
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
  }
//initialise form by info user
  initFomForUser(){
     this.caisse_vendeur_id = this.caisse.caisse_vendeur_id
     this.nom_caisse = this.caisse.nom_caisse
     this.point_de_vente_id = this.caisse.point_de_vente_id
     this.utilisateur_id = this.caisse.utilisateur_id
     this.solde_caisse = this.caisse.solde_caisse
  }

  //Submit form user
  onSubmitForm(form: NgForm){
    // const client: Client = form.value;
    // if (this.action === 'edit') {
    //   client.client_id = this.client.client_id
    //   this.clientService.updateClient(client).subscribe(data => {
    //     console.log(data);
    //     this.message = data.message
    //     this.router.navigateByUrl('client/list')
    //     this.globaService.toastShow(this.message,'Succès','success')
    //   })
    // }else{
    //   console.log(client);
    //   this.clientService.createClient(client).subscribe(data => {
    //     console.log(data);
    //     this.message = data.message
    //     this.router.navigateByUrl('client/list')
    //     this.globaService.toastShow(this.message,'Succès','success')
    //   })
    // }
  }
}
