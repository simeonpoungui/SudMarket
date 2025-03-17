import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Depense, GetDepense } from 'src/app/Models/depenses.model';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { DepensesService } from 'src/app/Services/depenses.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { UsersService } from 'src/app/Services/users.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-depense-form',
  templateUrl: './depense-form.component.html',
  styleUrls: ['./depense-form.component.scss']
})
export class DepenseFormComponent {

  @Input() action!: string;

  id_depense!: number;
  date_heure!: string;
  categorie_depense!: string;
  montant!: number;
  employe_responsable!: number;
  note_additionnelle?: string;
  fournisseur!: string;
  point_de_vente_id!: number;
  tbPointdeVente!: PointsDeVentes[];
  tbUsers: Utilisateur[] = [];

  user!: Utilisateur;

  constructor(
    private route: ActivatedRoute,
    private userService: UsersService,
    private router: Router,
    private pointService: PointsDeVentesService,
    private depenseService: DepensesService
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.date_heure = now.toISOString().slice(0, 16);
    
    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user = JSON.parse(utilisateurJson);
      console.log(this.user);
      this.employe_responsable = this.user.utilisateur_id
    }
    this.action = this.route.snapshot.params['action'];
    this.id_depense = +this.route.snapshot.params['id'];
    console.log(this.action, this.id_depense);

    if (this.action === 'edit') {
      this.initFomForDepense();
    }

    this.loadPointDeVente();
    this.loadUsers();
  }

    loadUsers() {
      const user: GetUser = { utilisateur_id: 0 };
      this.userService.getListUser(user).subscribe((data) => {
        console.log(data);
        this.tbUsers = data.message;
      });
    }


  getUserName(utilisateur_id: number): string {
    const user = this.tbUsers.find((u) => u.utilisateur_id === utilisateur_id);
    return user? user.nom_utilisateur + ' ' + user.prenom_utilisateur: 'Unknown User';
  }


  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
    });
  }

  initFomForDepense() {
    const depense: GetDepense = {
      id_depense: this.id_depense
    };
    this.depenseService.getOneDepense(depense).subscribe((res) => {
      console.log(res.message);
      this.date_heure = res.message.date_heure;
      this.categorie_depense = res.message.categorie_depense;
      this.montant = res.message.montant;
      this.employe_responsable = Number(res.message.employe_responsable);
      this.note_additionnelle = res.message.note_additionnelle;
      this.fournisseur = res.message.fournisseur;
      this.point_de_vente_id = res.message.point_de_vente_id;
    });
  }

  //Submit form depense
  onSubmitForm(form: NgForm) {
    const depense: Depense = form.value;
    depense.employe_responsable = this.user.utilisateur_id
    console.log(depense);
     if (this.action === 'edit') {
       depense.id_depense = this.id_depense;
       this.depenseService.updateDepense(depense).subscribe((data) => {
         console.log(data);
         this.router.navigateByUrl('/depense/list')
       });
     } else {
       console.log(depense);
       this.depenseService.createDepense(depense).subscribe((data) => {
         console.log(data);
         this.router.navigateByUrl('/depense/list')
       });
     }
  }
}
