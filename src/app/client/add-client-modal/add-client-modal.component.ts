import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { ClientsService } from 'src/app/Services/clients.service';
import { GlobalService } from 'src/app/Services/global.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';

@Component({
  selector: 'app-add-client-modal',
  templateUrl: './add-client-modal.component.html',
  styleUrls: ['./add-client-modal.component.scss']
})
export class AddClientModalComponent {
  @Input() action!:string;

  client!: Client;
  client_id!: number;
  nom!: string;
  prenom?: string;
  mot_de_passe_hash!: string;
  email?: string;
  telephone?: string;
  sexe?: string;
  adresse?: string;
  nationalite?: string;
  cree_le?: Date;
  message!: any
  tbPointdeVente!: PointsDeVentes[]
  point_de_vente_id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private pointService: PointsDeVentesService,
    private globaService: GlobalService,
    private clientService: ClientsService
  ){}

  isFormValid(): any {
    // return this.nom && this.prenom && this.email && this.telephone && this.sexe;
  }

  ngOnInit(): void {
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

  //Submit form user
  onSubmitForm(form: NgForm){
    const client: Client = form.value;
    console.log(client);
    this.dialog.getDialogById('AddClientModalComponent')?.close(true)
     this.clientService.createClient(client).subscribe(data => {
       console.log(data);
       this.message = data.message
       this.globaService.toastShow(this.message,'Succès','success')
       this.dialog.getDialogById('AddClientModalComponent')?.close(true)
     })
    }
}
