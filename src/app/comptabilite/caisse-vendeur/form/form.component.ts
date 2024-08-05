import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CaisseVendeur } from 'src/app/Models/historiqueCaisseVendeur.model';
import { GetPointsDeVentes,PointsDeVentes} from 'src/app/Models/pointsDeVentes.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { CaissesService } from 'src/app/Services/caisses.service';
import { ClientsService } from 'src/app/Services/clients.service';
import { GlobalService } from 'src/app/Services/global.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})

export class FormComponent {
  action!: string;
  caisse_vendeur_id!: number;
  nom_caisse!: string;
  point_de_vente_id!: number;
  utilisateur_id!: number;
  solde_caisse!: number;
  date_creation!: Date;
  date_mise_a_jour!: Date;
  actif!: boolean;
  caisse!: CaisseVendeur;
  tbPointdeVente!: PointsDeVentes[];
  tbUsers!: Utilisateur[]
  message: any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService,
    private pointService: PointsDeVentesService,
    private globaService: GlobalService,
    private clientService: ClientsService,
    private caisseService: CaissesService
  ) {}

  isFormValid(): any {
    return (
      this.nom_caisse &&
      this.point_de_vente_id &&
      this.utilisateur_id &&
      this.solde_caisse
    );
  }

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action'];
    console.log(this.action);
    const CaisseSON = localStorage.getItem('selectedCaisseVendeur');
    if (CaisseSON) {
      this.caisse = JSON.parse(CaisseSON);
      console.log(this.caisse);
    }
    if (this.action === 'edit') {
      this.initFomForCaisse();
    }
    this.loadPointDeVente();
    this.loadUser()
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
    });
  }

  loadUser() {
    const user: GetUser = { utilisateur_id: 0 };
    this.userService.getListUser(user).subscribe((data) => {
      console.log(data.message);
      this.tbUsers = data.message;
    });
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(
      (p) => p.point_de_vente_id === point_de_vente_id
    );
    return point ? point.nom : 'Unknown Point';
  }

  getUserName(utilisateur_id: any): string {
    const user = this.tbUsers.find(
      (u) => u.utilisateur_id === utilisateur_id
    );
    return user ? user.nom_utilisateur : 'Unknown User';
  }

  initFomForCaisse() {
    this.caisse_vendeur_id = this.caisse.caisse_vendeur_id;
    this.nom_caisse = this.caisse.nom_caisse;
    this.point_de_vente_id = this.caisse.point_de_vente_id;
    this.utilisateur_id = this.caisse.utilisateur_id;
    this.solde_caisse = this.caisse.solde_caisse;
    this.actif = this.caisse.actif;

  }
  onSubmitForm(form: NgForm) {
     const caissev: CaisseVendeur = form.value;
     console.log(caissev);
     if (this.action === 'edit') {
      caissev.caisse_vendeur_id = this.caisse.caisse_vendeur_id
       this.caisseService.updateCaisseVendeur(caissev).subscribe(data => {
         console.log(data);
         this.message = data.message
         this.router.navigateByUrl('caisse-vendeur')
         this.globaService.toastShow(this.message,'Succès','success')
       })
     }else{
       this.caisseService.createCaisseVendeur(caissev).subscribe(data => {
         console.log(data.message);
         this.message = data.message
         this.router.navigateByUrl('caisse-vendeur')
         this.globaService.toastShow(this.message,'Succès','success')
       })
     }
  }
}
