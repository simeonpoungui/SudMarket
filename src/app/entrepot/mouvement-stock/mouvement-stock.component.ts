import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Component, ViewChild } from '@angular/core';
import { EntrepotService } from 'src/app/Services/entrepot.service';
import { Entrepot, GetEntrepot } from 'src/app/Models/entrepot.model';
import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit, Produit } from 'src/app/Models/produit.model';

@Component({
  selector: 'app-mouvement-stock',
  templateUrl: './mouvement-stock.component.html',
  styleUrls: ['./mouvement-stock.component.scss']
})
export class MouvementStockComponent {
  dataSource!: any;
 displayedColumns = [
    // 'ref_produit',       // SKU (Référence produit)
    'produit',           // Nom du produit
    'libelle',           // Libellé (ici "Transfert stock")
    'origine',           // Entrepôt d'origine
    'destination',       // Point de vente de destination
    'stock_initial',     // Stock initial
    'entree',            // Quantité entrée
    'sortie',            // Quantité sortie
    'stock_final',       // Stock final
    'date_mouvement',    // Date du mouvement
    // 'observations',      // Observations
    'combination_hash',  // Hash de la combinaison
    'type_produit',      // Type du produit
];

  isloadingpage!: boolean
  selectedFournisseurString: string = ''
  nbrefournisseur: number = 0
  tbProduit: Produit[] = [];

  
  constructor(
    private entrepotService: EntrepotService,
    private router: Router,
    private produitService: ProduitService,
    private globalService: GlobalService,
    private dialog: MatDialog
  ){}

  TbEntrepot: Entrepot[]  = []

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListMouvement()
    this.loadProduit()

  }

    loadProduit(){
        const produit : GetProduit = {produit_id: 0}
        this.produitService.getList(produit).subscribe(data => {
          console.log(data.message);
          this.tbProduit = data.message
          console.log(this.tbProduit);
          
        })
      }
  
      getProduitName(produit_id: number): string {
        const produit = this.tbProduit.find(p => p.produit_id === produit_id);
        return produit ? (produit.nom ): '';
      }

  getListMouvement(){ 
    this.isloadingpage = true
    this.entrepotService.getListMouvement(0).subscribe(data => {
      console.log(data.message);
      this.nbrefournisseur = data.message.length
      this.isloadingpage = false
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.TbEntrepot = data.message
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
}
