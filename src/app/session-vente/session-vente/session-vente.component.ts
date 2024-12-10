import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { Component, HostListener, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {
  GetPointsDeVentes,
  PointsDeVentes,
} from 'src/app/Models/pointsDeVentes.model';
import { ArticlesDeVentes } from 'src/app/Models/articlesDeVente.model';
import { ArticlesDeVenteService } from 'src/app/Services/articles-de-vente.service';
import { Vente } from 'src/app/Models/vente.model';
import { VenteService } from 'src/app/Services/vente.service';
import { GlobalService } from 'src/app/Services/global.service';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { SelectClientComponent } from 'src/app/client/select-client/select-client.component';
import { Client } from 'src/app/Models/clients.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { SessionService } from 'src/app/Services/session.service';
import { Session } from 'src/app/Models/session.ventes.model';
import { AlertInfoComponent } from 'src/app/core/alert-info/alert-info.component';
import { CaissesService } from 'src/app/Services/caisses.service';
import { SelectPointDeVenteComponent } from 'src/app/settings/points-de-ventes/select-point-de-vente/select-point-de-vente.component';
import { Facture } from 'src/app/Models/Facture.model';

@Component({
  selector: 'app-session-vente',
  templateUrl: './session-vente.component.html',
  styleUrls: ['./session-vente.component.scss'],
})
export class SessionVenteComponent {
  dataSource!: any;
  tbarticle: any[] = [];
  selectedArticleId: number | null = null;
  quantitesProduits: { [produitId: number]: number } = {};
  quantiteMode: boolean = false; // Mode pour définir la quantité
  calculatriceValeur: string = '';
  isQtySelected: boolean = false;

  displayedColumnsArticleVente = ['produit_id', 'quantite', 'prixTotal'];

  displayedColumns = [
    'nom',
    'description',
    'categorie',
    'prix',
    'quantite_en_stock',
    'Actions',
  ];

  sessionStartTime!: Date;
  sessionEndTime!: Date;
  imageproduit: { [key: number]: string } = {};
  tbprovisoire!: ArticlesDeVentes[];
  tbProduit!: Produit[];
  isloadingpage!: boolean;
  pointSelected!: PointsDeVentes;
  MontantTotalApyer!: number;
  checkedProducts: any;
  isloadingpaiement!: boolean;
  isloadingbtnvalidate!: boolean;
  montantTotalDeLaVente: number = 0;
  message!: any;
  clientSelected!: Client;
  user!: Utilisateur;
  modepaiement?: string;
  currentSessionId: number | undefined;
  IDcaissevendeur!: number;
  sessionActive: boolean = true;
  nouvelleQuantite!: number;

  Facture!: Facture;

  constructor(
    private produitService: ProduitService,
    private router: Router,
    public globlService: GlobalService,
    private venteService: VenteService,
    private caisseService: CaissesService,
    private sessionService: SessionService,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const storedPointSelected = localStorage.getItem('pointDeVente');
    if (storedPointSelected) {
      this.pointSelected = JSON.parse(storedPointSelected);
      console.log(this.pointSelected);
    }
    // get user localStorage
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }
    this.selectQty();
    this.getListProduit();

  }

  getListProduit() {
    const point_de_vente_id: GetProduit = {
      produit_id: 0,
    };
    this.produitService.getList(point_de_vente_id).subscribe((data) => {
        console.log(data.message);
        if (typeof data.message === 'string') {
          this.sessionActive = false;
          this.endSession();
          const dialog = this.dialog.open(AlertInfoComponent);
          dialog.afterClosed().subscribe((result) => {
            this.router.navigateByUrl('/');
          });
          dialog.componentInstance.content =
            'Desolé Aucun produit trouvé avec ce point de vente : ' +
            ' ' +
            this.pointSelected.nom;
          this.dataSource = new MatTableDataSource([]);
        } else {
          this.dataSource = new MatTableDataSource(data.message);
          this.tbProduit = data.message;
          this.tbProduit.forEach((produit) => {
            this.getImageByproduiID(produit.produit_id);
          });
        }
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  ajouterArticle(produit: any): void {
    const articleExistant = this.tbarticle.find(
      (article) => article.produit_id === produit.produit_id
    );
    if (articleExistant) {
      // Ajouter 1 à la quantité existante, et vérifier que le résultat est un entier
      const nouvelleQuantite = articleExistant.quantite + 1;
      if (Number.isInteger(nouvelleQuantite) && nouvelleQuantite >= 0) {
        articleExistant.quantite = nouvelleQuantite;
        articleExistant.prix_total_vente = nouvelleQuantite * produit.prix;
        this.quantitesProduits[produit.produit_id] = nouvelleQuantite; // Mise à jour de la quantité
      }
    } else {
      const nouvelleQuantite = 1;  // Définir la quantité initiale comme 1
      if (Number.isInteger(nouvelleQuantite) && nouvelleQuantite >= 0) {
        this.tbarticle.push({
          produit_id: produit.produit_id,
          quantite: nouvelleQuantite,
          prix: produit.prix,
          prix_total_vente: produit.prix,
        });
        this.quantitesProduits[produit.produit_id] = nouvelleQuantite;
      }
    }
    this.selectedArticleId = produit.produit_id;
    console.log(this.tbarticle, this.quantitesProduits);
  }

  selectArticle(articleId: number): void {
    this.selectedArticleId = articleId; 
  }

  selectQty(): void {
    this.isQtySelected = !this.isQtySelected; // Inverser l'état à chaque clic
    console.log('Qty sélectionné:', this.isQtySelected);
  }


  modifierQuantiteArticle(valeur: string | number): void {
    if (this.selectedArticleId !== null) {
      const article = this.tbarticle.find(
        (art) => art.produit_id === this.selectedArticleId
      );
  
      if (article) {
        let nouvelleQuantite = String(article.quantite); // Utiliser la quantité actuelle comme chaîne
  
        if (valeur === '+/-') {
          // Inverser le signe de la quantité
          nouvelleQuantite = (Number(nouvelleQuantite) * -1).toString();
        } else if (valeur === '.') {
          // Ajouter un point décimal seulement si la quantité est >= 10 et qu'il n'y a pas déjà un point
          if (Number(nouvelleQuantite) >= 2 && !nouvelleQuantite.includes('.')) {
            nouvelleQuantite += '.';
          }
        } else {
          // Si la quantité est inférieure à 10, remplacer le chiffre
          if (Number(nouvelleQuantite) < 2) {
            nouvelleQuantite = String(valeur);
          } else {
            // Si la quantité est >= 10, ajouter le chiffre à la fin de la quantité
            nouvelleQuantite += valeur;
          }
        }
        // Vérifier si la nouvelle quantité est valide
        const quantiteNumerique = parseFloat(nouvelleQuantite);
        // Vérifier si la quantité est un nombre positif et valide
        if (!isNaN(quantiteNumerique) && quantiteNumerique >= 0) {
          article.quantite = quantiteNumerique;
          article.prix_total_vente = article.quantite * article.prix;
          this.quantitesProduits[article.produit_id] = quantiteNumerique;
          this.tbarticle = [...this.tbarticle];  // Forcer la détection des changements
          console.log(this.tbarticle);
        } else {
          console.error('Quantité invalide');
        }
      }
    } else {
      console.error('Aucun article sélectionné');
    }
  }
  
  // Calculer le total des articles
  calculerTotalArticles(): number {
    return this.tbarticle.reduce((total, article) => {
      const prixTotal = Number(article.prix_total_vente); // Convertir en nombre
      return total + prixTotal; // Additionner les prix
    }, 0);
  }
  


// Réinitialiser la ligne sélectionnée
resetArticle(): void {
  if (this.selectedArticleId !== null) {
    const article = this.tbarticle.find(
      (art) => art.produit_id === this.selectedArticleId
    );
    if (article) {
      article.quantite = 1; // Réinitialiser la quantité
      article.prix_total_vente = article.quantite * article.prix; // Calculer le prix total en fonction de la quantité
      this.quantitesProduits[article.produit_id] = 1; // Mettre à jour la quantité dans quantitesProduits
      this.tbarticle = [...this.tbarticle]; // Forcer la détection des changements
      console.log('Article réinitialisé:', article);
    }
  } else {
    console.error('Aucun article sélectionné');
  }
}


selectAction(action: string): void {
  if (action === 'reset') {
    this.resetArticle(); 
  } else {
    console.log(`Action sélectionnée: ${action}`);
  }
}

  
  getProduitName(produit_id: number): string {
    const produit = this.tbProduit.find((p) => p.produit_id === produit_id);
    return produit ? produit.nom : '';
  }

  getImageByproduiID(IDproduit: number) {
    const produit: GetProduit = { produit_id: IDproduit };
    this.produitService.getImageByProduit(produit).subscribe((data) => {
      console.log(data);
      if (data.message) {
        this.imageproduit[IDproduit] = `${data.message}`;
        console.log(this.imageproduit);
      } else {
        console.log(`Aucune image trouvée pour le produit ID: ${IDproduit}`);
      }
    });
  }

  openPointsDeVentes() {
    const dialog = this.dialog.open(SelectPointDeVenteComponent);
    dialog.afterClosed().subscribe((result) => {
      this.pointSelected = dialog.componentInstance.pointSelected;
      console.log(this.pointSelected);
      if (this.pointSelected) {
        // this.startSession();
        this.getCaisseUser();
      } else {
        this.router.navigateByUrl('/');
        this.globlService.toastShow(
          'Vous devez selectionner un point de vente',
          'Information',
          'info'
        );
      }
    });
  }

  getCaisseUser() {
    const user: GetUser = { utilisateur_id: this.user.utilisateur_id };
    this.caisseService.getCaisseByUser(user).subscribe((data) => {
      console.log(data.message);
      this.IDcaissevendeur = data.message.caisse_vendeur_id;
      console.log(this.IDcaissevendeur);
    });
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  ValidatePaiement() {}

  imprimerPDFFacture() {
    this.venteService.ImpressionFacture(this.Facture).subscribe((data) => {
      console.log(data);
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'Rapport_de_cloture_de_caisse.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      const pdfWindow = window.open('');
      if (pdfWindow) {
        pdfWindow.document.write(
          "<iframe width='100%' height='100%' style='border:none' src='" +
            url +
            "'></iframe>"
        );
      }
    });
  }

  chooseClient() {
    const dialog = this.dialog.open(SelectClientComponent);
    dialog.id = 'SelectClientComponent';
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.clientSelected = dialog.componentInstance.clientSelected;
        console.log(this.clientSelected);
      }
    });
  }

  //Session vente
  ngOnDestroy() {
    this.endSession();
  }

  startSession() {
    this.sessionStartTime = new Date();
    const newSession: Session = {
      user_id: this.user.utilisateur_id,
      start_time: this.sessionStartTime,
      session_id: 0,
    };
    this.sessionService.createSession(newSession).subscribe((response) => {
      this.globlService.toastShow(
        'Session ouvert le' +
          ' ' +
          this.globlService.formatFrenchDateSessionVnte(this.sessionStartTime),
        'Succès'
      );
      this.currentSessionId = response.message.session_id;
    });
  }

  endSession() {
    if (this.sessionStartTime && this.currentSessionId) {
      this.sessionEndTime = new Date();
      console.log('Session terminée à :', this.sessionEndTime);
      const updatedSession: Session = {
        session_id: Number(this.currentSessionId),
        user_id: this.user.utilisateur_id,
        start_time: this.sessionStartTime,
        end_time: this.sessionEndTime,
      };
      this.sessionService
        .updateSession(updatedSession)
        .subscribe((response) => console.log(response));
    }
  }

  closeSession() {
    const dialog = this.dialog.open(AlertComponent);
    dialog.componentInstance.content =
      'Voulez-vous fermer cette session de vente ?';
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.sessionActive = false;
        this.endSession();
        this.globlService.toastShow(
          'Session Fermé le' +
            ' ' +
            this.globlService.formatFrenchDateSessionVnte(this.sessionEndTime),
          'Succès'
        );
        this.globlService.reloadComponent('vente-journaliere');
      }
    });
  }
}
