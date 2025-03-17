import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GetPointsDeVentes,PointsDeVentes} from 'src/app/Models/pointsDeVentes.model';
import { ArticlesDeVentes } from 'src/app/Models/articlesDeVente.model';
import { GlobalService } from 'src/app/Services/global.service';
import { Utilisateur } from 'src/app/Models/users.model';
import { CommandeService } from 'src/app/Services/commande.service';
import { Fournisseur } from 'src/app/Models/fournisseur.model';
import { AlertInfoComponent } from 'src/app/core/alert-info/alert-info.component';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { EntrepotService } from 'src/app/Services/entrepot.service';
import { Entrepot,GetEntrepot,ModelSendAddProductEntrepot,StocksEntrepots} from 'src/app/Models/entrepot.model';
import { StockProduitsVariablesEntrepotsComponent } from '../stock-produits-variables-entrepots/stock-produits-variables-entrepots.component';

@Component({
  selector: 'app-stock-entrepots',
  templateUrl: './stock-entrepots.component.html',
  styleUrls: ['./stock-entrepots.component.scss'],
})
export class StockEntrepotsComponent {

  dataSource!: any;
  dataSourceStocksEntrepots = new MatTableDataSource<StocksEntrepots>([]);
  displayedColumnsArticleVente = ['produit_id', 'quantite'];
  displayedColumns = ['nom', 'description', 'categorie', 'prix', 'Actions'];
  sessionStartTime!: Date;
  sessionEndTime!: Date;

  tbprovisoire!: ArticlesDeVentes[];
  tbProduit!: Produit[];
  tbselectionsProduitsVariables: any[] = [];

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
  tbPointdeVente: PointsDeVentes[] = [];
  tbEntrepots: Entrepot[] = [];
  entrepot_id!: number;
  modepaiement: number = 1;
  currentSessionId: number | undefined;
  selectedEntrepotId!: number; 

  constructor(
    private produitService: ProduitService,
    private router: Router,
    public globlService: GlobalService,
    private entrepotService: EntrepotService,
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
    this.getListProduit();
    this.loadPointDeVente();
    this.loadEntrepot();
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
    });
  }

  loadEntrepot() {
    const entrepot: GetEntrepot = { entrepot_id: 0 };
    this.entrepotService.getListEntrepot(entrepot).subscribe((data) => {
      console.log(data.message);
      this.tbEntrepots = data.message;
    });
  }

  getPointName(point_de_vente_id?: number): string {
    const point = this.tbPointdeVente.find(
      (p) => p.point_de_vente_id === point_de_vente_id
    );
    return point ? point.nom : 'Unknown Point';
  }

  getListProduit() {
    const produit: GetProduit = {
      produit_id: 0,
    };
    this.isloadingpage = true;
    this.produitService.getList(produit).subscribe((data) => {
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
        const indexArticleVente = this.dataSourceStocksEntrepots.data.findIndex(
          (item: StocksEntrepots) => item.produit_id === element.produit_id
        );
        if (indexArticleVente !== -1) {
          const updatedData = [...this.dataSourceStocksEntrepots.data];
          updatedData.splice(indexArticleVente, 1);
          this.dataSourceStocksEntrepots.data = updatedData;
        }
      } else {
        this.addProductToEntrepot(element);
      }
    } else if (element.type_produit === 'variable') {
      const dialog = this.dialog.open(StockProduitsVariablesEntrepotsComponent);
      dialog.componentInstance.produitChoosed = element;
      dialog.id = 'SelectVariationsComponent';
      dialog.afterClosed().subscribe((result) => {
        if (result) {
          console.log(result);
          this.tbselectionsProduitsVariables =
            dialog.componentInstance.tbselectionsProduitsVariables;
          console.log(this.tbselectionsProduitsVariables);
          this.tbselectionsProduitsVariables.forEach((variation) => {
            console.log(variation);
            this.addProductToProductEntrepotsVariables(variation);
          });
        }
      });
    }
  }

  addProductToProductEntrepotsVariables(variation: any) {
    const entrepots: StocksEntrepots = {
      variation_id: variation.id,
      produit_id: variation.produit_id,
      combination_hash: variation.combinaison,
      quantite: variation.quantite,
      type_produit: 'variable',
    };
    console.log(entrepots);
    this.dataSourceStocksEntrepots.data = [
      ...this.dataSourceStocksEntrepots.data,
      entrepots,
    ];
  }

  addProductToEntrepot(produit: Produit) {
    const entrepot: StocksEntrepots = {
      variation_id: 0,
      produit_id: produit.produit_id,
      quantite: 1,
      combination_hash: '######',
      type_produit: 'simple',
    };
    console.log(entrepot);
    this.dataSourceStocksEntrepots.data = [
      ...this.dataSourceStocksEntrepots.data,
      entrepot,
    ];
  }

  onEntrepotSelected(event: any) {
    this.selectedEntrepotId = event.value;
  }

  Valider() {
    this.isloadingpaiement = true
    const model: ModelSendAddProductEntrepot = {
      entrepot_id: this.selectedEntrepotId,
      tbStockEntrepots: this.dataSourceStocksEntrepots.data,
    };
    console.log(model);
    if (model && this.selectedEntrepotId) {
      this.entrepotService.StockcreateEntrepot(model).subscribe((res) => {
        console.log(res.message);
        this.message = res.message;
        this.isloadingpaiement = false
        this.globalService.toastShow(this.message, 'Succès');
        this.router.navigateByUrl('/entrepot-stock-list')
      });
    } else {
      this.globalService.toastShow(
        "Veuillez sélectionner un ou plusieurs produits ainsi qu'un entrepôt.",
        'Information',
        'info'
      );
    }
  }
}
