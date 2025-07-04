import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { Entrepot, GetEntrepot } from 'src/app/Models/entrepot.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { EntrepotService } from 'src/app/Services/entrepot.service';
import { GlobalService } from 'src/app/Services/global.service';
import { UsersService } from 'src/app/Services/users.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-entrepot-fiche',
  templateUrl: './entrepot-fiche.component.html',
  styleUrls: ['./entrepot-fiche.component.scss'],
})
export class EntrepotFicheComponent {
  action!: string;
  entrepot_id!: number;
  nom!: string;
  adresse!: string;
  responsable!: string;
  telephone!: string;
  ville!: string;
  email!: string;
  capacite_stockage!: number;
  message!: any;
  tbUsers: Utilisateur[] = [];
  globalService: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private userService: UsersService,
    private entrepotService: EntrepotService,
    private globaService: GlobalService
  ) {}

  isFormValid(): any {
    return this.nom && this.adresse && this.responsable;
  }

  goBack(){
    this.location.back()
  }

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action'];
    this.entrepot_id = this.route.snapshot.params['id'];
    console.log(this.action, this.entrepot_id);

    this.initFormEntrepot();
    this.loadUsers();
  }

  loadUsers() {
    const user: GetUser = { utilisateur_id: 0 };
    this.userService.getListUser(user).subscribe((data) => {
      console.log(data);
      this.tbUsers = data.message;
      console.log(this.tbUsers);
    });
  }

  initFormEntrepot() {
    const entrepot: GetEntrepot = {
      entrepot_id: this.entrepot_id,
    };
    this.entrepotService.getOneEntrepot(entrepot).subscribe((res) => {
      console.log(res.message);
      this.nom = res.message.nom;
      this.adresse = res.message.adresse;
      this.responsable = res.message.responsable;
      this.telephone = res.message.telephone;
      this.ville = res.message.ville;
      this.email = res.message.email;
      this.capacite_stockage = res.message.capacite_stockage;
    });
  }

  update() {
    this.router.navigateByUrl('entrepot/edit/' + this.entrepot_id);
  }

  delete(){
        const alert = this.dialog.open(AlertComponent)
        alert.componentInstance.content = "Voulez-vous supprimé l'entrepot " + this.nom + ' ?'
        alert.componentInstance.backgroundColor = "danger"
        alert.afterClosed().subscribe(confirmDelete => {
          if (confirmDelete) {
            this.entrepotService.deleteEntrepot(this.entrepot_id).subscribe(data => {
              console.log(data.message);
              this.message = data.message
              this.globalService.toastShow(this.message,'Succès','success')
              this.router.navigateByUrl('/entrepot-list')
            } )
          }
        })
  }
}
