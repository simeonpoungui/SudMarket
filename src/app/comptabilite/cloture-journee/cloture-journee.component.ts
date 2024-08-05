import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertInfoComponent } from 'src/app/core/alert-info/alert-info.component';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { GetCaisseVendeur } from 'src/app/Models/caissevendeur.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { CaissesService } from 'src/app/Services/caisses.service';
import { GlobalService } from 'src/app/Services/global.service';

@Component({
  selector: 'app-cloture-journee',
  templateUrl: './cloture-journee.component.html',
  styleUrls: ['./cloture-journee.component.scss'],
})
export class ClotureJourneeComponent {
  user!: Utilisateur;
  date_comptable!: any;
  historique_caisse_id!: number;
  caisse_vendeur_id!: number;
  solde_ouverture: string = '0';
  solde_fermeture: string = '0';
  TotalRetraits: string = '0';
  TotalVersements: string = '0';
  solde_confirme: boolean = false;
  commentaires!: string;
  caisse!: string;
  IdCaisseSelected!: number;
  constructor(
    private caisseService: CaissesService,
    private dialog: MatDialog,
    public globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.getCurrentDateFormatted();
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }
    this.getCaisseVendeur();
  }

  getCurrentDateFormatted() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    this.date_comptable = `${year}-${month}-${day}`;
    console.log(this.date_comptable);
    //  console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  }

  getCaisseVendeur() {
    const user: GetUser = {
      utilisateur_id: this.user.utilisateur_id,
    };
    this.caisseService.getCaisseByUser(user).subscribe((data) => {
      console.log(data.message);
      this.caisse = data.message.nom_caisse;
      this.solde_ouverture = data.message.solde_caisse;
      this.IdCaisseSelected = data.message.caisse_vendeur_id;
      this.caisse_vendeur_id = data.message.caisse_vendeur_id;
      this.getInfoByJourneeComptable(
        data.message.caisse_vendeur_id,
        this.date_comptable
      );
    });
  }
  getInfoByJourneeComptable(IDcaisse: number, date_comptable: Date) {
    this.caisseService
      .getinfocaisseJourneeComptable(IDcaisse, date_comptable)
      .subscribe((data) => {
        console.log(data.message);
        this.caisse_vendeur_id = data.message.caisse_vendeur_id;
        this.solde_ouverture = data.message.solde_ouverture;
        this.solde_fermeture = data.message.solde_fermeture;
        this.TotalRetraits = data.message.TotalRetraits;
        this.TotalVersements = data.message.TotalVersements;
        this.solde_confirme = data.message.solde_confirme;
        this.commentaires = data.message.commentaires;
      });
  }

  selectDate(event: any) {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (selectedDate > currentDate) {
      const dialog = this.dialog.open(AlertInfoComponent);
      dialog.componentInstance.content =
        "La date sélectionnée est supérieure à la date d'aujourd'hui.";
      dialog.afterClosed().subscribe((close) => {
        window.location.reload();
      });
    } else {
      console.log(event.target.value);
      this.caisseService
        .getSoldeCaisseByDateComptable(
          this.IdCaisseSelected,
          event.target.value
        )
        .subscribe((data) => {
          console.log(data.message);
          if (typeof data.message == 'string') {
            this.globalService.toastShow(
              'Aucune caisse trouvée pour les critères spécifiés',
              'Information'
            );
            this.getCurrentDateFormatted();
          } else {
            this.getInfoByJourneeComptable(
              this.IdCaisseSelected,
              event.target.value
            );
          }
        });
    }
  }

  confirmeSolde() {}

  ClotureJourneeComptable() {
    const vendeur: GetCaisseVendeur = {
      caisse_vendeur_id: this.caisse_vendeur_id,
      date_comptable: this.date_comptable,
    };
    console.log(vendeur);
    this.caisseService.clotureJourneeComptable(vendeur).subscribe((data) => {
      console.log(data);
    });
  }
}
