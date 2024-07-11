import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { ArticlesDeVentes } from 'src/app/Models/articlesDeVente.model';
import { ArticlesDeVenteService } from 'src/app/Services/articles-de-vente.service';
import { Vente } from 'src/app/Models/vente.model';
import { VenteService } from 'src/app/Services/vente.service';
import { GlobalService } from 'src/app/Services/global.service';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { SelectClientComponent } from 'src/app/client/select-client/select-client.component';
import { Client } from 'src/app/Models/clients.model';
import { Utilisateur } from 'src/app/Models/users.model';
import { SessionService } from 'src/app/Services/session.service';
import { Session } from 'src/app/Models/session.ventes.model';
import { ArticlesCommandesAchatsComponent } from '../articles-commandes-achats/articles-commandes-achats.component';
import { ArticlesDeCommandeDAchat } from 'src/app/Models/articles.commandes.achats';
import { CommandeAchat } from 'src/app/Models/commande.model';
import { CommandeService } from 'src/app/Services/commande.service';
import { SelectFournisseurComponent } from 'src/app/fournisseur/select-fournisseur/select-fournisseur.component';
import { Fournisseur } from 'src/app/Models/fournisseur.model';

@Component({
  selector: 'app-session-commande',
  templateUrl: './session-commande.component.html',
  styleUrls: ['./session-commande.component.scss']
})
export class SessionCommandeComponent {
  dataSource!: any;
  dataSourceArticleCommandesAchats = new MatTableDataSource<ArticlesDeCommandeDAchat>([]);
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
  founisseurSelected!: Fournisseur;
  user!: Utilisateur;
  modepaiement: number = 1;
  currentSessionId: number | undefined;

  constructor(
    private produitService: ProduitService,
    private router: Router,
    public globlService: GlobalService,
    private articleDeVenteService: ArticlesDeVenteService,
    private commandeService: CommandeService,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListProduit();
    const storedPointSelected = localStorage.getItem('pointSelectedCommande');
    if (storedPointSelected) {
      this.pointSelected = JSON.parse(storedPointSelected);
      console.log(this.pointSelected);
    }
    this.calculateTotalVente();
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }
  }

  getListProduit() {
    const produit: GetProduit = { produit_id: 0 };
    this.isloadingpage = true;
    this.produitService.getList(produit).subscribe((data) => {
      console.log(data.message);
      this.tbProduit = data.message;
      this.isloadingpage = false;
      this.dataSource = new MatTableDataSource(data.message);
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
      const indexArticleVente = this.dataSourceArticleCommandesAchats.data.findIndex(
        (item: ArticlesDeCommandeDAchat) => item.produit_id === element.produit_id
      );
      if (indexArticleVente !== -1) {
        const updatedData = [...this.dataSourceArticleCommandesAchats.data];
        updatedData.splice(indexArticleVente, 1);
        this.dataSourceArticleCommandesAchats.data = updatedData;
      }
    } else {
      this.addProductToArticleVente(element);
    }
  }

  addProductToArticleVente(produit: Produit) {
    const articleCommande: ArticlesDeCommandeDAchat = {
      article_commande_achat_id: 0,
      point_de_vente_id: this.pointSelected.point_de_vente_id,
      commande_achat_id: 0,
      produit_id: produit.produit_id,
      quantite: 1,
      prix_unitaire: produit.prix,
      prix_total_commande: this.calculateTotalApayerByProduit({
        article_commande_achat_id: 0,
        commande_achat_id: 0,
        produit_id: produit.produit_id,
        quantite: 1,
        prix_unitaire: produit.prix,
        prix_total_commande: 0,
      }),
    };
console.log(articleCommande);

    this.dataSourceArticleCommandesAchats.data = [
      ...this.dataSourceArticleCommandesAchats.data,
      articleCommande,
    ];
    this.updatePrixTotalVente();
    this.montantTotalDeLaVente = this.calculateTotalVente();
  }

  calculateTotalApayerByProduit(element: ArticlesDeCommandeDAchat): number {
    return element.quantite * element.prix_unitaire;
  }

  updatePrixTotalVente() {
    this.dataSourceArticleCommandesAchats.data = this.dataSourceArticleCommandesAchats.data.map(
      (element) => {
        element.prix_total_commande = this.calculateTotalApayerByProduit(element);
        return element;
      }
    );
  }

  updateQuantity(element: ArticlesDeCommandeDAchat) {
    this.updatePrixTotalVente();
    this.montantTotalDeLaVente = this.calculateTotalVente();
  }

  calculateTotalVente(): number {
    return this.dataSourceArticleCommandesAchats.data.reduce(
      (acc, element) => acc + element.prix_total_commande,
      0
    );
  }

  selectmodepaiement(event: any) {
    this.modepaiement = Number(event.target.value);
  }

  ValidatePaiement() {
    if (
      this.dataSourceArticleCommandesAchats.data.length > 0 &&
      this.founisseurSelected &&
      this.modepaiement
    ) {
      const dialog = this.dialog.open(AlertComponent);
      dialog.componentInstance.type = 'info';
      dialog.componentInstance.content =
        'Voulez-vous effectuer cette transaction ?';
      dialog.afterClosed().subscribe((result) => {
        if (result) {
          this.isloadingpaiement = true;
          const modelCommande: CommandeAchat = {
            commande_achat_id: 0,
            point_de_vente_id: this.pointSelected.point_de_vente_id,
            montant_total: this.montantTotalDeLaVente,
            fournisseur_id: this.founisseurSelected.fournisseur_id,
            utilisateur_id: this.user.utilisateur_id,
            articles: this.dataSourceArticleCommandesAchats.data
          };
          console.log(modelCommande);
          this.commandeService.create(modelCommande).subscribe((data) => {
            console.log(data.message);
            this.dataSourceArticleCommandesAchats.data = [];
            this.montantTotalDeLaVente = 0;
            localStorage.removeItem('pointSelected');
            this.founisseurSelected = {} as Fournisseur;    
            this.message = data.message;
            this.globlService.toastShow(this.message, 'Succès');
            this.isloadingpaiement = false;
            this.getListProduit();
            this.router.navigateByUrl('commande/achat/list')
          });
        }
      });
    } else {
      const dialog = this.dialog.open(AlertComponent);
      dialog.componentInstance.content =
        'Selectionner un ou des produits, renseigner le fournisseur concerné et le moyen de paiement';
    }
  }

  chooseFournisseur() {
    const dialog = this.dialog.open(SelectFournisseurComponent);
    dialog.afterClosed().subscribe((data) => {
      this.founisseurSelected = dialog.componentInstance.fournisseurSelected;
      console.log(this.founisseurSelected);
    });
  }
}
