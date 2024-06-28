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

  tbprovisoire!: ArticlesDeVentes[];
  tbProduit!: Produit[]
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

  constructor(
    private produitService: ProduitService,
    private router: Router,
    private globlService: GlobalService,
    private venteService: VenteService,
    private articleDeVenteService: ArticlesDeVenteService,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListProduit();
    const storedPointSelected = localStorage.getItem('pointSelected');
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
      this.tbProduit = data.message
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
      vente_id: 0,
      produit_id: produit.produit_id,
      quantite: 1,
      prix_unitaire: produit.prix,
      remise: 0,
      prix_total_vente:0
    };
    const tempDataSource: ArticlesDeVentes[] = [
      ...this.dataSourceArticleVente.data,
      articleVente,
    ];
    console.log(tempDataSource);
    this.dataSourceArticleVente.data = tempDataSource;
    console.log(this.dataSourceArticleVente.data);
    this.montantTotalDeLaVente = this.calculateTotalVente();
  }

  updateQuantity(element: ArticlesDeVentes) {
    const index = this.dataSourceArticleVente.data.findIndex(
      (item) => item.produit_id === element.produit_id
    );
    if (index !== -1) {
      this.dataSourceArticleVente.data[index].quantite = element.quantite;
      console.log(this.dataSourceArticleVente.data);
      this.montantTotalDeLaVente = this.calculateTotalVente();
    }
  }

  calculateTotalApayerByProduit(element: ArticlesDeVentes): number {
    return element.quantite * element.prix_unitaire;
  }
  calculateTotalVente(): number {
    let total = 0;
    this.dataSourceArticleVente.data.forEach((article) => {
      total += article.prix_unitaire * article.quantite;
    });
    return total;
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
            articles: this.dataSourceArticleVente.data,
          };
          console.log(modelvente);
          this.venteService.create(modelvente).subscribe((data) => {
            console.log(data.message);
            this.dataSourceArticleVente.data = []
            this.getListProduit()
            this.message = data.message;
            this.globlService.toastShow(this.message, 'Succès');
            this.isloadingpaiement = false;
            // this.router.navigateByUrl('vente/list')
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
    dialog.afterClosed().subscribe((data) => {
      this.clientSelected = dialog.componentInstance.clientSelected;
      console.log(this.clientSelected);
    });
  }
}
