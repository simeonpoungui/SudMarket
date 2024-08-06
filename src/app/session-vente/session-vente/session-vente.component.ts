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

@Component({
  selector: 'app-session-vente',
  templateUrl: './session-vente.component.html',
  styleUrls: ['./session-vente.component.scss'],
})
export class SessionVenteComponent {
  dataSource!: any;
  dataSourceArticleVente = new MatTableDataSource<ArticlesDeVentes>([]);
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
  modepaiement: number = 1;
  currentSessionId: number | undefined;
  IDcaissevendeur!: number
  sessionActive: boolean = true;

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
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.sessionActive) {
          this.router.navigate(['/session-vente']);
          this.globlService.toastShow(
            "Vous devez d'abord fermer la session",
            'Attention',
            'error'
          );
        }
      }
    });

    // get point de vente local Sotage
    const storedPointSelected = localStorage.getItem('pointSelected');
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

    this.getListProduit();
    this.calculateTotalVente();

    this.startSession();
    this.getCaisseUser()
  }

  getCaisseUser(){
    const user: GetUser = {utilisateur_id: this.user.utilisateur_id}
    this.caisseService.getCaisseByUser(user).subscribe( data => {
      console.log(data.message);
      this.IDcaissevendeur = data.message.caisse_vendeur_id
      console.log(this.IDcaissevendeur);
      
    })
  }

  getListProduit() {
    const point: GetPointsDeVentes = {
      point_de_vente_id: this.pointSelected.point_de_vente_id,
    };
    this.produitService.getListProduityByPointVente(point).subscribe((data) => {
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
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  checkedProduit(event: any, element: Produit) {
    if (!event.target.checked) {
      const indexArticleVente = this.dataSourceArticleVente.data.findIndex(
        (item: ArticlesDeVentes) => item.produit_id === element.produit_id
      );
      if (indexArticleVente !== -1) {
        const updatedData = [...this.dataSourceArticleVente.data];
        updatedData.splice(indexArticleVente, 1);
        this.dataSourceArticleVente.data = updatedData;
      }
    } else {
      this.addProductToArticleVente(element);
    }
  }

  addProductToArticleVente(produit: Produit) {
    const articleVente: ArticlesDeVentes = {
      article_de_vente_id: 0,
      point_de_vente_id: this.pointSelected.point_de_vente_id,
      vente_id: 0,
      produit_id: produit.produit_id,
      quantite: 1,
      prix_unitaire: produit.prix,
      remise: 0,
      prix_total_vente: this.calculateTotalApayerByProduit({
        article_de_vente_id: 0,
        vente_id: 0,
        produit_id: produit.produit_id,
        quantite: 1,
        prix_unitaire: produit.prix,
        remise: 0,
        prix_total_vente: 0,
      }),
    };

    this.dataSourceArticleVente.data = [
      ...this.dataSourceArticleVente.data,
      articleVente,
    ];
    this.updatePrixTotalVente();
    this.montantTotalDeLaVente = this.calculateTotalVente();
  }

  calculateTotalApayerByProduit(element: ArticlesDeVentes): number {
    return element.quantite * element.prix_unitaire;
  }

  updatePrixTotalVente() {
    this.dataSourceArticleVente.data = this.dataSourceArticleVente.data.map(
      (element) => {
        element.prix_total_vente = this.calculateTotalApayerByProduit(element);
        return element;
      }
    );
  }

  updateQuantity(element: ArticlesDeVentes) {
    this.updatePrixTotalVente();
    this.montantTotalDeLaVente = this.calculateTotalVente();
  }

  calculateTotalVente(): number {
    return this.dataSourceArticleVente.data.reduce(
      (acc, element) => acc + element.prix_total_vente,
      0
    );
  }

  selectmodepaiement(event: any) {
    this.modepaiement = Number(event.target.value);
  }

  ValidatePaiement() {
    if (
      this.dataSourceArticleVente.data.length > 0 &&
      this.clientSelected &&
      this.modepaiement
    ) {
      const dialog = this.dialog.open(AlertComponent);
      dialog.componentInstance.type = 'info';
      dialog.componentInstance.content =
        'Voulez-vous effectuer cette transaction ?';
      dialog.afterClosed().subscribe((result) => {
        if (result) {
          this.isloadingpaiement = true;
          const modelvente: Vente = {
            vente_id: 0,
            montant_total: this.montantTotalDeLaVente,
            client_id: this.clientSelected.client_id,
            utilisateur_id: this.user.utilisateur_id,
            caisse_vendeur_id: this.IDcaissevendeur,
            point_de_vente_id: this.pointSelected.point_de_vente_id,
            articles: this.dataSourceArticleVente.data,
          };
          console.log(modelvente);
          this.venteService.create(modelvente).subscribe({
            next: (data) => {
              console.log(data);
              this.dataSourceArticleVente.data = [];
              this.montantTotalDeLaVente = 0;
              localStorage.removeItem('pointSelected');
              this.clientSelected = {} as Client;
              this.globlService.toastShow("Vente effectuée avec succès", 'Succès');
              this.isloadingpaiement = false;
              this.getListProduit();
            },
            error: (error) => {
              console.error("Erreur lors de la création de la vente:", error);
              this.globlService.toastShow("Erreur lors de la création de la vente", 'Erreur');
              this.isloadingpaiement = false;
            }
          });
          
        }
      });
    } else {
      const dialog = this.dialog.open(AlertComponent);
      dialog.componentInstance.content =
        'Selectionner un ou des produits, renseigner le client concerné et le moyen de paiement';
    }
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
