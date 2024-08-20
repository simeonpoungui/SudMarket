import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertInfoComponent } from 'src/app/core/alert-info/alert-info.component';
import { BordereauDeClotureDecaisse } from 'src/app/Models/BordereaudeClotureDecaisse.model';
import { HistoriqueCaisseVendeur } from 'src/app/Models/historiqueCaisseVendeur.model';
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
  solde_ouverture?: string = this.globalService.formatPrixString('0');
  solde_fermeture?: string = this.globalService.formatPrixString('0');
  TotalRetraits?: string = this.globalService.formatPrixString('0');
  TotalVersements?: string = this.globalService.formatPrixString('0');
  solde_confirme?: number = 0;
  commentaires: string = ' ';
  caisse!: string;
  IdCaisseSelected!: number;
  Billets!: number;
  Pieces!: number;

  Valeur_Unitaire_Billet_10000: number = 10000;
  Valeur_Unitaire_Billet_5000: number = 5000;
  Valeur_Unitaire_Billet_2000: number = 2000;
  Valeur_Unitaire_Billet_1000: number = 1000;
  Valeur_Unitaire_Billet_500: number = 500;
  Valeur_Unitaire_Piece_500: number = 500;
  Valeur_Unitaire_Piece_100: number = 100;
  Valeur_Unitaire_Piece_50: number = 50;
  Valeur_Unitaire_Piece_25: number = 25;

  // Nombres de billets et pièces
  Billets_10000_nombre: number = 0;
  Billets_5000_nombre: number = 0;
  Billets_2000_nombre: number = 0;
  Billets_1000_nombre: number = 0;
  Billets_500_nombre: number = 0;
  Pieces_500_nombre: number = 0;
  Pieces_100_nombre: number = 0;
  Pieces_50_nombre: number = 0;
  Pieces_25_nombre: number = 0;

  // Sommes
  Billets_10000_somme: number = 0;
  Billets_5000_somme: number = 0;
  Billets_2000_somme: number = 0;
  Billets_1000_somme: number = 0;
  Billets_500_somme: number = 0;
  Pieces_500_somme: number = 0;
  Pieces_100_somme: number = 0;
  Pieces_50_somme: number = 0;
  Pieces_25_somme: number = 0;

  // Totaux
  totalBillets: number = 0;
  totalSommeBillets: number = 0;

  // Totaux
  totalPieces: number = 0;
  totalSommePieces: number = 0;
  isloadingpage!: boolean;
  
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
      if (typeof data.message == "string") {
        this.solde_ouverture = this.globalService.formatPrixString("0")
      }else{
        this.caisse = data.message.nom_caisse;
        this.solde_ouverture = this.globalService.formatPrixString(data.message.solde_caisse);
        this.solde_fermeture = this.globalService.formatPrixString(data.message.solde_caisse)
        this.IdCaisseSelected = data.message.caisse_vendeur_id;
        this.caisse_vendeur_id = data.message.caisse_vendeur_id;
        this.getInfoByJourneeComptable(data.message.caisse_vendeur_id,this.date_comptable);
        this.getBorderauDesCaisses(data.message.caisse_vendeur_id,this.date_comptable)
      }
    });
  }
  getInfoByJourneeComptable(IDcaisse: number, date_comptable: Date) {
    this.caisseService.getinfocaisseJourneeComptable(IDcaisse, date_comptable).subscribe((data) => {
        console.log(data.message);
        if (typeof data.message == 'string') {
          this.TotalRetraits = this.globalService.formatPrixString("0");
          this.TotalVersements = this.globalService.formatPrixString("0");
          this.solde_confirme = 0;
          this.commentaires = " ";
        }else{
          this.caisse_vendeur_id = data.message.caisse_vendeur_id;
          this.solde_ouverture = data.message.solde_ouverture;
          this.solde_fermeture = data.message.solde_fermeture;
          this.TotalRetraits = data.message.TotalRetraits;
          this.TotalVersements = data.message.TotalVersements;
          this.solde_confirme = data.message.solde_confirme;
          this.commentaires = data.message.commentaires;
        }
      });
  }

  getBorderauDesCaisses(IDcaisse: number, date_comptable: Date){
    const bordereau = {
      caisse_vendeur_id: IDcaisse,
      date_comptable :  date_comptable
    }
    console.log(bordereau);
    
    this.caisseService.getBordereauDesCiasses(bordereau).subscribe(data => {
      console.log(data.message);
      if (typeof data.message == "string") {
        this.Billets_10000_nombre = 0;
        this.Billets_5000_nombre = 0;
        this.Billets_2000_nombre = 0;
        this.Billets_1000_nombre = 0;
        this.Billets_500_nombre = 0;
        this.Pieces_500_nombre = 0;
        this.Pieces_100_nombre = 0;
        this.Pieces_50_nombre = 0;
        this.Pieces_25_nombre = 0;
        
        this.Billets_10000_somme = 0 ;
        this.Billets_5000_somme = 0;
        this.Billets_2000_somme = 0;
        this.Billets_1000_somme = 0;
        this.Billets_500_somme = 0;
        this.Pieces_500_somme = 0;
        this.Pieces_100_somme = 0;
        this.Pieces_50_somme = 0;
        this.Pieces_25_somme = 0;
        this.totalBillets = 0
        this.totalPieces = 0
      }else{
        this.Billets_10000_nombre = data.message.Billets_10000_nombre;
        this.Billets_5000_nombre = data.message.Billets_5000_nombre;
        this.Billets_2000_nombre = data.message.Billets_2000_nombre;
        this.Billets_1000_nombre = data.message.Billets_1000_nombre;
        this.Billets_500_nombre = data.message.Billets_500_nombre;
        this.Pieces_500_nombre = data.message.Pieces_500_nombre;
        this.Pieces_100_nombre = data.message.Pieces_100_nombre;
        this.Pieces_50_nombre = data.message.Pieces_50_nombre;
        this.Pieces_25_nombre = data.message.Pieces_25_nombre;
        
        this.Billets_10000_somme = data.message.Billets_10000_somme;
        this.Billets_5000_somme = data.message.Billets_5000_somme;
        this.Billets_2000_somme = data.message.Billets_2000_somme;
        this.Billets_1000_somme = data.message.Billets_1000_somme;
        this.Billets_500_somme = data.message.Billets_500_somme;
        this.Pieces_500_somme = data.message.Pieces_500_somme;
        this.Pieces_100_somme = data.message.Pieces_100_somme;
        this.Pieces_50_somme = data.message.Pieces_50_somme;
        this.Pieces_25_somme = data.message.Pieces_25_somme;
        this.totalBillets = data.message.Billets
        this.totalPieces = data.message.Pieces
      }
    })
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
            this.getCaisseVendeur()
          } else {
            this.getInfoByJourneeComptable(this.IdCaisseSelected,event.target.value);
            this.getBorderauDesCaisses(this.IdCaisseSelected,event.target.value)
          }
        });
    }
  }

  confirmeSolde(event: any) {
    console.log((event.target.checked = false));
    const dialog = this.dialog.open(AlertInfoComponent);
    dialog.componentInstance.content =
      'etes-vous sur de vouloir confirmé le solde ?';
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.solde_confirme = 1;
        event.target.checked = false;
      }
    });
  }

  SendCommentaires(event: any) {
    console.log(event.target.value);
    this.commentaires = event.target.value;
  }

  ClotureJourneeComptable() {
    const vendeur: HistoriqueCaisseVendeur = {
      caisse_vendeur_id: this.caisse_vendeur_id,
      date_comptable: this.date_comptable,
      commentaires: this.commentaires,
      solde_confirme: this.solde_confirme,
    };
    console.log(vendeur);
    this.caisseService.clotureJourneeComptable(vendeur).subscribe((data) => {
      console.log(data.message);
      this.globalService.toastShow('Journée cloturée avec succès', 'Succès');
    });
  }

  calculerSomme(type: string): void {
    switch (type) {
      case 'Billets_10000':
        this.Billets_10000_somme =
          this.Billets_10000_nombre * this.Valeur_Unitaire_Billet_10000;
        break;
      case 'Billets_5000':
        this.Billets_5000_somme =
          this.Billets_5000_nombre * this.Valeur_Unitaire_Billet_5000;
        break;
      case 'Billets_2000':
        this.Billets_2000_somme =
          this.Billets_2000_nombre * this.Valeur_Unitaire_Billet_2000;
        break;
      case 'Billets_1000':
        this.Billets_1000_somme =
          this.Billets_1000_nombre * this.Valeur_Unitaire_Billet_1000;
        break;
      case 'Billets_500':
        this.Billets_500_somme =
          this.Billets_500_nombre * this.Valeur_Unitaire_Billet_500;
        break;
      case 'Pieces_500':
        this.Pieces_500_somme =
          this.Pieces_500_nombre * this.Valeur_Unitaire_Piece_500;
        break;
      case 'Pieces_100':
        this.Pieces_100_somme =
          this.Pieces_100_nombre * this.Valeur_Unitaire_Piece_100;
        break;
      case 'Pieces_50':
        this.Pieces_50_somme =
          this.Pieces_50_nombre * this.Valeur_Unitaire_Piece_50;
        break;
      case 'Pieces_25':
        this.Pieces_25_somme =
          this.Pieces_25_nombre * this.Valeur_Unitaire_Piece_25;
        break;
    }

    this.calculerTotalBillets();
    this.calculerTotalPieces();
  }

  calculerTotalBillets(): void {
    this.totalBillets =
      this.Billets_10000_nombre +
      this.Billets_5000_nombre +
      this.Billets_2000_nombre +
      this.Billets_1000_nombre +
      this.Billets_500_nombre;
    this.totalSommeBillets =
      this.Billets_10000_somme +
      this.Billets_5000_somme +
      this.Billets_2000_somme +
      this.Billets_1000_somme +
      this.Billets_500_somme;
  }

  calculerTotalPieces(): void {
    this.totalPieces =
      this.Pieces_500_nombre +
      this.Pieces_100_nombre +
      this.Pieces_50_nombre +
      this.Pieces_25_nombre;
    this.totalSommePieces =
      this.Pieces_500_somme +
      this.Pieces_100_somme +
      this.Pieces_50_somme +
      this.Pieces_25_somme;
  }

  onSubmitForm(form: NgForm) {
    const bordereau: BordereauDeClotureDecaisse = form.value;
    bordereau.Billets = this.totalBillets;
    bordereau.Pieces = this.totalPieces;
    bordereau.caisse_vendeur_id = this.caisse_vendeur_id;
    bordereau.date_comptable = this.date_comptable;
    console.log(bordereau);
    if (this.solde_confirme == 1 && bordereau) {
      this.isloadingpage = true;
      this.caisseService.createBordereauDesCaisse(bordereau).subscribe((data) => {
        console.log(data.message);
        this.isloadingpage = false;
        this.globalService.toastShow(
          'Bordereau des caisses crée avec succès',
          'Succès'
        );
      });
      this.ClotureJourneeComptable();
    }else{
      const dialog = this.dialog.open(AlertInfoComponent)
      dialog.componentInstance.content = "Vous devez remplir le tableau du bordereau de cloture de caisse et cocher la case de confirmation!"
    }

    
  }
}
