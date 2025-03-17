import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Component, ViewChild } from '@angular/core';
import { EntrepotService } from 'src/app/Services/entrepot.service';
import { Entrepot, GetEntrepot } from 'src/app/Models/entrepot.model';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Services/produit.service';

@Component({
  selector: 'app-list-product-entrepots',
  templateUrl: './list-product-entrepots.component.html',
  styleUrls: ['./list-product-entrepots.component.scss']
})
export class ListProductEntrepotsComponent {
  dataSource!: any;
  displayedColumns = [
    'entrepot_id',
    'produit_id',
    'quantite',
    'type_produit',
    'combination_hash',
    'Actions'
  ];

  isloadingpage!: boolean
  selectedFournisseurString: string = ''
  nbrefournisseur: number = 0
  tbProduit: Produit[] = []
  tbEntrepot: Entrepot[] = []

  entrepot_id!: number ;
  produit_id!: number ;
  type_produit!: string ;

  
  constructor(
    private entrepotService: EntrepotService,
    private router: Router,
    private produitService: ProduitService,
    private globalService: GlobalService,
    private dialog: MatDialog
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListsStockEntrepot()
    this.loadProduit()
    this.loadEntrepot()

  }

  loadEntrepot(){
    const entrepot : GetEntrepot = {entrepot_id: 0}
    this.entrepotService.getListEntrepot(entrepot).subscribe(data => {
      console.log(data.message);
      this.tbEntrepot = data.message
    })
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

    getEntrepotName(entrepot_id: number): string {
      const entrepot = this.tbEntrepot.find(e => e.entrepot_id === entrepot_id);
      return entrepot ? (entrepot.nom ): '';
    }

  getListsStockEntrepot(){
    this.isloadingpage = true
    this.entrepotService.getListStockEntrepot(0).subscribe(data => {
      console.log(data);
      this.nbrefournisseur = data.message.length
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
    this.router.navigateByUrl('entrepot/create/' + 0 )
  }


  actions(element: Entrepot){
     this.router.navigateByUrl('entrepot-fiche/view/' + element.entrepot_id)
  }

 // Méthode générique pour filtrer les stocks
 filterStocks(): void {
  // Envoi de la requête de filtrage avec les critères sélectionnés
  this.entrepotService.FiltreStockEntrepot(this.entrepot_id, this.produit_id, this.type_produit).subscribe(res => {
    console.log(res.message);
    this.dataSource = new MatTableDataSource(res.message);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  });
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
