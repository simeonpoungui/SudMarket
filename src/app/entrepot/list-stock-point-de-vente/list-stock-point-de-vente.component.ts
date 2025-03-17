import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { ClientsService } from 'src/app/Services/clients.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { EntrepotService } from 'src/app/Services/entrepot.service';
import { Entrepot } from 'src/app/Models/entrepot.model';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Services/produit.service';

@Component({
  selector: 'app-list-stock-point-de-vente',
  templateUrl: './list-stock-point-de-vente.component.html',
  styleUrls: ['./list-stock-point-de-vente.component.scss']
})
export class ListStockPointDeVenteComponent {

  dataSource!: any;
  displayedColumns = [
    'point_de_vente_id',
    'entrepot_id',
    'produit_id',
    'quantite',
    'combination_hash',
    'type_produit',
    'Actions'
  ];

  isloadingpage!: boolean
  selectedClientstring: string = ''
  tbPointdeVente: PointsDeVentes[] = []
  tbEntrepot: Entrepot[] = []
  tbProduit: Produit[] = [];

  entrepot_id!: number ;
  produit_id!: number ;
  type_produit!: string ;
  point_de_vente_id!: number

  nbclients: number = 0

  constructor(
    private router: Router,
    private clientService: ClientsService,
    private entrepotService: EntrepotService,
    private globalService: GlobalService,
        private produitService: ProduitService,
  
    private pointService: PointsDeVentesService,
    private dialog: MatDialog
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListstockPointDeVente()
    this.loadPointDeVente()
    this.loadProduit()
    this.loadEntrepot()
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
  loadEntrepot(entrepot_id?: number) {
    const entrepot: any = { entrepot_id:entrepot_id  };
    this.entrepotService.getListEntrepot(entrepot).subscribe((data) => {
      console.log(data.message);
      this.tbEntrepot = data.message
    });
  }

  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
      
    } )
  }

  getEntrepotName(entrepot_id: number): string {
    const entrepot = this.tbEntrepot.find(
      (p) => p.entrepot_id === entrepot_id
    );
    return entrepot ? entrepot.nom : 'Unknown entrepot';
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
  }
  
  getListstockPointDeVente(){
    this.isloadingpage = true
    this.entrepotService.getListStockPointDeVente(0).subscribe(data => {
      console.log(data.message);
      this.nbclients = data.message.length
      this.isloadingpage = false
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
     });
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  create(){
    this.router.navigateByUrl('client/create')
  }

  actions(element: Client){
    console.log(element);
    this.selectedClientstring = JSON.stringify(element); 
    localStorage.setItem('selectedClient', this.selectedClientstring);
    if (this.selectedClientstring) {
      this.router.navigateByUrl('fiche/client/view')
    }
  }

   // Méthode générique pour filtrer les stocks
   filterStocks(): void {
    // Envoi de la requête de filtrage avec les critères sélectionnés
    this.entrepotService.FiltreStockPointDeVente(this.entrepot_id, this.produit_id, this.type_produit, this.point_de_vente_id).subscribe(res => {
      console.log(res.message);
      
      // Vérifie que res.message est bien une chaîne de caractères
      if (typeof res.message === 'string') {
        this.dataSource = new MatTableDataSource([]); 
        this.globalService.toastShow(res.message,"Information")
      } else {
        this.dataSource = new MatTableDataSource(res.message); // Si ce n'est pas une chaîne, c'est probablement un tableau
      }
      
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }
  

// Appelée lors du changement de l'entrepôt
onPointChange(event: any): void {
  console.log(event.target.value);
  this.point_de_vente_id = Number(event.target.value);
  this.filterStocks();  // Appel à la méthode générique pour filtrer
}

// Appelée lors du changement de l'entrepôt
onEntrepotChange(event: any): void {
  console.log(event.target.value);
  this.entrepot_id = Number(event.target.value);
  this.filterStocks();  // Appel à la méthode générique pour filtrer
}

// Appelée lors du changement du produit
onProduitChange(event: any): void {
  console.log(event.target.value);
  this.produit_id = Number(event.target.value);
  this.filterStocks();  // Appel à la méthode générique pour filtrer
}

// Appelée lors du changement du type de produit
onTypeProduitChange(event: any): void {
  console.log(event.target.value);
  this.type_produit = event.target.value;
  this.filterStocks();  // Appel à la méthode générique pour filtrer
}

}
