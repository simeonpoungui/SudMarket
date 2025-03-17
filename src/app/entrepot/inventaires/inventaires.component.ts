import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Entrepot, GetEntrepot } from 'src/app/Models/entrepot.model';
import { GetInventaire, Inventaire } from 'src/app/Models/inventaire.model';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { Utilisateur } from 'src/app/Models/users.model';
import { EntrepotService } from 'src/app/Services/entrepot.service';
import { GlobalService } from 'src/app/Services/global.service';
import { ProduitService } from 'src/app/Services/produit.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-inventaires',
  templateUrl: './inventaires.component.html',
  styleUrls: ['./inventaires.component.scss']
})
export class InventairesComponent {

  dataSource!: any;
  displayedColumns = [
    'entrepot_id',
    'produit_id',
    'quantite_comptee',
    'quantite_initiale',
    'ecart',
    'motif',
    'date_inventaire',
    'type_produit',
    'combination_hash',
    'Actions'
  ];

  tbProduit: Produit[] = []
  tbEntrepot: Entrepot[] = []

  isloadingpage!: boolean

    constructor(
      private entrepotService: EntrepotService,
      private router: Router,
      private userService: UsersService,
      private produitService: ProduitService,
      private globalService: GlobalService,
      private dialog: MatDialog
    ) {}
  
      @ViewChild(MatSort, { static: true }) sort!: MatSort;
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      
    ngOnInit(): void {
      this.getqListInventaires()
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
        
    getqListInventaires(){
      this.isloadingpage = true
      const inventaire: GetInventaire = {
        id: 0
      }
      this.entrepotService.getListInventaires(inventaire).subscribe(res =>{
        console.log(res.message);
        this.isloadingpage = false
        this.dataSource = new MatTableDataSource(res.message);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;      })
    }

    actions(id: number){
      console.log(id);
      this.router.navigateByUrl('/inventaire-form/edit/' + id)
      
    }
}
