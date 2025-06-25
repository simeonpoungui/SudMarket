import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { StockProduitsVariablesEntrepotsComponent } from '../stock-produits-variables-entrepots/stock-produits-variables-entrepots.component';
import { modelSendStockPointVente, StockPointVente } from 'src/app/Models/stock.point.de.vente.model';
import { VariationByIdComponent } from '../variation-by-id/variation-by-id.component';

@Component({
  selector: 'app-transfert-stock-entrepot-point-de-vente',
  templateUrl: './transfert-stock-entrepot-point-de-vente.component.html',
  styleUrls: ['./transfert-stock-entrepot-point-de-vente.component.scss']
})
export class TransfertStockEntrepotPointDeVenteComponent {
  dataSource!: any;
  dataSourceStocksPointVente = new MatTableDataSource<StockPointVente>([]);
  displayedColumnsArticleVente = ['produit_id', 'quantite', 'niveau_de_reaprovisionnement'];
  displayedColumns = ['produit_id', 'quantite', 'type_produit', 'combination_hash', 'Actions'];
  sessionStartTime!: Date;
  sessionEndTime!: Date;

  tbprovisoire!: ArticlesDeVentes[];
  tbProduit: Produit[] = [];
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
  EntrepotsName!: string;
  entrepot_id?: number;
  modepaiement: number = 1;
  currentSessionId: number | undefined;
  selectedEntrepotId!: number; 
  point_de_vente_id!: number

  constructor(
    private produitService: ProduitService,
    private router: Router,
    public globlService: GlobalService,
    private entrepotService: EntrepotService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    private pointService: PointsDeVentesService,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const entrepot_id = +this.route.snapshot.params['id']
    this.entrepot_id = entrepot_id
    console.log(this.entrepot_id);
    
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }
    this.loadPointDeVente();
    this.loadProduit()

  }

    loadProduit(){
      const produit : GetProduit = {produit_id: 0}
      this.produitService.getList(produit).subscribe(data => {
        console.log(data.message);
        this.tbProduit = data.message
      })
    }

    getProduitName(produit_id: number): string {
      const produit = this.tbProduit.find(p => p.produit_id === produit_id);
      return produit ? (produit.nom ): '';
    }

  PointDeVenteSelected(event: any){
    console.log(event.value);
    this.point_de_vente_id = (event.value)
    const point: GetPointsDeVentes = {point_de_vente_id: Number(event.value)}
    this.pointService.getOne(point).subscribe(res  =>{
      console.log(res.message);
      this.getListProduit(res.message.entrepot_id)
      this.loadEntrepot(res.message.entrepot_id)
      this.entrepot_id = res.message.entrepot_id
    })
    
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
    });
  }

  loadEntrepot(entrepot_id?: number) {
    const entrepot: any = { entrepot_id:entrepot_id  };
    this.entrepotService.getOneEntrepot(entrepot).subscribe((data) => {
      console.log(data.message);
      this.EntrepotsName = data.message.nom;
      console.log(this.EntrepotsName);
      
    });
  }

  getPointName(point_de_vente_id?: number): string {
    const point = this.tbPointdeVente.find(
      (p) => p.point_de_vente_id === point_de_vente_id
    );
    return point ? point.nom : 'Unknown Point';
  }

  getListProduit(entrepot_id?: number) {
    console.log(entrepot_id);
    
    this.isloadingpage = true;
    this.entrepotService.FiltreStockEntrepotID(entrepot_id).subscribe((data) => {
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
        const indexArticleVente = this.dataSourceStocksPointVente.data.findIndex(
          (item: StockPointVente) => item.produit_id === element.produit_id
        );
        if (indexArticleVente !== -1) {
          const updatedData = [...this.dataSourceStocksPointVente.data];
          updatedData.splice(indexArticleVente, 1);
          this.dataSourceStocksPointVente.data = updatedData;
        }
      } else {
        this.addProductToEntrepot(element);
      }
    } else if (element.type_produit === 'variable') {
      const dialog = this.dialog.open(VariationByIdComponent);
      dialog.componentInstance.produitChoosed = element;
      dialog.id = 'VariationByIdComponent';
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
    const stockpointvente: StockPointVente = {
      variation_id: variation.id,
      produit_id: variation.produit_id,
      combination_hash: variation.combinaison,
      quantite: variation.quantite,
      type_produit: 'variable',
      point_de_vente_id: this.point_de_vente_id,
      niveau_de_reaprovisionnement: variation.niveau_de_reapprovisionnement
    };
    console.log(stockpointvente);
    this.dataSourceStocksPointVente.data = [
      ...this.dataSourceStocksPointVente.data,
      stockpointvente,
    ];
  }

  addProductToEntrepot(produit: Produit) {
    const stockpointvente: StockPointVente = {
      variation_id: 0,
      produit_id: produit.produit_id,
      quantite: 1,
      combination_hash: '######',
      type_produit: 'simple',
      point_de_vente_id: this.point_de_vente_id,
      niveau_de_reaprovisionnement: 0
    };
    console.log(stockpointvente);
    this.dataSourceStocksPointVente.data = [
      ...this.dataSourceStocksPointVente.data,
      stockpointvente,
    ];
  }

  onEntrepotSelected(event: any) {
    this.selectedEntrepotId = event.value;
  }

  Valider() {
    this.isloadingpaiement = true
    const model: modelSendStockPointVente = {
      entrepot_id: this.entrepot_id,
      TbStockProduit: this.dataSourceStocksPointVente.data
    }
    console.log(model);
      if (model) {
        this.entrepotService.AddStockPointDeVente(model).subscribe((res) => {
          console.log(res);
          this.message = res.message;
          this.isloadingpaiement = false
          this.globalService.toastShow(this.message, 'Succès');
         //  this.router.navigateByUrl('/entrepot-stock-list')
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
