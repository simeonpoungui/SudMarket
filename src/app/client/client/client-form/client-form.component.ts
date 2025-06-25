import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, GetClient } from 'src/app/Models/clients.model';
import {
  GetPointsDeVentes,
  PointsDeVentes,
} from 'src/app/Models/pointsDeVentes.model';
import { ClientsService } from 'src/app/Services/clients.service';
import { GlobalService } from 'src/app/Services/global.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent {
  @Input() action!: string;

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
  message!: any;
  tbPointdeVente!: PointsDeVentes[];
  point_de_vente_id: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private pointService: PointsDeVentesService,
    private globaService: GlobalService,
    private clientService: ClientsService
  ) {}

  isFormValid(): any {
    return this.nom && this.prenom && this.email && this.telephone && this.sexe;
  }

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action'];
    console.log(this.action);
    const utilisateurJson = localStorage.getItem('selectedClient');
    if (utilisateurJson) {
      this.client = JSON.parse(utilisateurJson);
      console.log(this.client);
    }
    if (this.action === 'edit') {
      this.initFomForUser();
    }
    this.loadPointDeVente();
  }

  goBack() {
    this.location.back();
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
    });
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(
      (p) => p.point_de_vente_id === point_de_vente_id
    );
    return point ? point.nom : 'Unknown Point';
  }
  //initialise form by info user
  initFomForUser() {
    this.client_id = this.client.client_id;
    this.nom = this.client.nom;
    this.prenom = this.client.prenom;
    this.email = this.client.email;
    this.telephone = this.client.telephone;
    this.sexe = this.client.sexe;
    this.point_de_vente_id = this.client.point_de_vente_id
    this.adresse = this.client.adresse;
    this.nationalite = this.client.nationalite;
    this.cree_le = this.client.cree_le;
  }

  //Submit form user
  onSubmitForm(form: NgForm) {
    const client: Client = form.value;
    if (this.action === 'edit') {
      client.client_id = this.client.client_id;
      this.clientService.updateClient(client).subscribe((data) => {
        console.log(data);
        this.message = data.message;
        this.router.navigateByUrl('client/list');
        this.globaService.toastShow(this.message, 'Succès', 'success');
      });
    } else {
      console.log(client);
      this.clientService.createClient(client).subscribe((data) => {
        console.log(data);
        this.message = data.message;
        this.router.navigateByUrl('client/list');
        this.globaService.toastShow(this.message, 'Succès', 'success');
      });
    }
  }
}
