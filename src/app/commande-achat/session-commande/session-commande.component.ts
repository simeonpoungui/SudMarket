import { ProduitService } from 'src/app/Services/produit.service';
import {Produit } from 'src/app/Models/produit.model';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {GetPointsDeVentes,PointsDeVentes} from 'src/app/Models/pointsDeVentes.model';
import { ArticlesDeVentes } from 'src/app/Models/articlesDeVente.model';
import { ArticlesDeVenteService } from 'src/app/Services/articles-de-vente.service';
import { GlobalService } from 'src/app/Services/global.service';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { Utilisateur } from 'src/app/Models/users.model';
import { ArticlesDeCommandeDAchat } from 'src/app/Models/articles.commandes.achats';
import { CommandeAchat, GetCommandeAchat } from 'src/app/Models/commande.model';
import { CommandeService } from 'src/app/Services/commande.service';
import { SelectFournisseurComponent } from 'src/app/fournisseur/select-fournisseur/select-fournisseur.component';
import { Fournisseur } from 'src/app/Models/fournisseur.model';
import { AlertInfoComponent } from 'src/app/core/alert-info/alert-info.component';
import { SelectPointDeVenteComponent } from 'src/app/settings/points-de-ventes/select-point-de-vente/select-point-de-vente.component';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { SelectVariationsComponent } from 'src/app/session-vente/select-variations/select-variations.component';
import { SelectVariationsCommandeComponent } from './select-variations-commande/select-variations-commande.component';

@Component({
  selector: 'app-session-commande',
  templateUrl: './session-commande.component.html',
  styleUrls: ['./session-commande.component.scss'],
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
  tbselectionsProduitsVariables: any[] = []

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
  tbPointdeVente!: PointsDeVentes[];
  modepaiement: number = 1;
  currentSessionId: number | undefined;

  constructor(
    private produitService: ProduitService,
    private router: Router,
    public globlService: GlobalService,
    private articleDeVenteService: ArticlesDeVenteService,
    private globalService: GlobalService,
    private commandeService: CommandeService,
    private pointService: PointsDeVentesService,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }
    this.calculateTotalVente();
    this.getListProduit();
    this.loadPointDeVente()
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
    });
  }

  getPointName(point_de_vente_id?: number): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
  }

  // openPointsDeVentesCommande(){
  //   const dialog = this.dialog.open(SelectPointDeVenteComponent);
  //   dialog.afterClosed().subscribe((result) => {
  //     this.pointSelected = dialog.componentInstance.pointSelected;
  //     console.log(this.pointSelected);
  //     this.calculateTotalVente();
  //     this.getListProduit();
  //   }); 
  // }
  
  getListProduit() {
    const point: GetPointsDeVentes = {
      point_de_vente_id: this.user.point_de_vente_id,
    };
    this.isloadingpage = true;
    this.produitService.getListProduityByPointVente(point).subscribe((data) => {
      console.log(data.message);
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([]);
        const dialog = this.dialog.open(AlertInfoComponent);
        dialog.afterClosed().subscribe((result) => {
          this.router.navigateByUrl('/');
          this.isloadingpage = false;
        });
      } else {
        this.dataSource = new MatTableDataSource(data.message);
        this.tbProduit = data.message;
        this.isloadingpage = false;
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
    console.log(element);
  
    // Vérification du type de produit
    if (element.type_produit === 'simple') {
      // Si c'est un produit simple, on l'ajoute directement
      if (!event.target.checked) {
        const indexArticleVente =
          this.dataSourceArticleCommandesAchats.data.findIndex(
            (item: ArticlesDeCommandeDAchat) =>
              item.produit_id === element.produit_id
          );
        if (indexArticleVente !== -1) {
          const updatedData = [...this.dataSourceArticleCommandesAchats.data];
          updatedData.splice(indexArticleVente, 1);
          this.dataSourceArticleCommandesAchats.data = updatedData;
        }
      } else {
        this.addProductToArticleVente(element);
      }
    } else if (element.type_produit === 'variable') {
      const dialog = this.dialog.open(SelectVariationsCommandeComponent);
      dialog.componentInstance.produitChoosed = element;
      
      dialog.id = 'SelectVariationsComponent';
    
      dialog.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
          this.tbselectionsProduitsVariables = dialog.componentInstance.tbselectionsProduitsVariables;
          console.log(this.tbselectionsProduitsVariables);
          
          this.tbselectionsProduitsVariables.forEach(variation => {
        
            // Conversion des prix en entiers
            const prixUnitaire = Number(variation.prix_unitaire);  // Conversion en entier
            const prixTotalCommande = Number(variation.prix_total_commande);  // Conversion en entier
        
            // Ajoutez les valeurs mises à jour dans la commande
            variation.prix_unitaire = prixUnitaire;
            variation.prix_total_commande = prixTotalCommande;
        
            console.log(variation);
            this.addProductToArticleCommandeVariables(variation);
          });
        }
        
      });
    }
    
  }

  addProductToArticleCommandeVariables(variation: any) {
    const prixTotalCommande = variation.prix_unitaire * variation.quantite;
    const articleCommande: ArticlesDeCommandeDAchat = {
      id: variation.id,
      article_commande_achat_id: 0,  // Si vous avez un ID, vous pouvez le générer ici
      point_de_vente_id: this.user.point_de_vente_id,
      commande_achat_id: 0,  // Idem, si nécessaire vous pouvez le générer
      produit_id: variation.produit_id,
      quantite: variation.quantite,  // Utilisation de la quantité dans la variation
      prix_unitaire: variation.prix_unitaire,  // Utilisation du prix unitaire converti
      prix_total_commande: prixTotalCommande,  // Calcul du prix total
    };
    console.log(articleCommande);
    this.dataSourceArticleCommandesAchats.data = [
      ...this.dataSourceArticleCommandesAchats.data,
      articleCommande,
    ];
      this.updatePrixTotalVente();
    this.montantTotalDeLaVente = this.calculateTotalVente();
  }
  
  

  addProductToArticleVente(produit: Produit) {
    const articleCommande: ArticlesDeCommandeDAchat = {
      article_commande_achat_id: 0,
      point_de_vente_id: this.user.point_de_vente_id,
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
    this.dataSourceArticleCommandesAchats.data =
      this.dataSourceArticleCommandesAchats.data.map((element) => {
        element.prix_total_commande =
          this.calculateTotalApayerByProduit(element);
        return element;
      });
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
            point_de_vente_id: this.user.point_de_vente_id,
            montant_total: this.montantTotalDeLaVente,
            fournisseur_id: this.founisseurSelected.fournisseur_id,
            utilisateur_id: this.user.utilisateur_id,
            articles: this.dataSourceArticleCommandesAchats.data,
          };
          console.log(modelCommande);
           this.commandeService.create(modelCommande).subscribe((data) => {
            
             console.log(data.message);
             console.log(data.commande_achat_id);
             this.impressionEtatCommandeAchatPdf(data.commande_achat_id)

             this.dataSourceArticleCommandesAchats.data = [];
             this.montantTotalDeLaVente = 0;
             this.founisseurSelected = {} as Fournisseur;
             this.message = data.message;
             this.globlService.toastShow(this.message, 'Succès');
             this.isloadingpaiement = false;
             this.globalService.reloadComponent('commande/achat/list')
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

  impressionEtatCommandeAchatPdf(commande_id: number) {
    const commande_achat_id: GetCommandeAchat = {
      commande_achat_id: commande_id
    };
    console.log(commande_achat_id);
    this.commandeService.etatcommandeAchat(commande_achat_id).subscribe(response => {
      // Créez un URL pour le blob
      const pdfUrl = URL.createObjectURL(response);
      window.open(pdfUrl, '_blank'); // '_blank' ouvre dans un nouvel onglet ou une nouvelle fenêtre
    }, error => {
      console.error('Erreur lors de la récupération du PDF', error);
    });
  }
}
