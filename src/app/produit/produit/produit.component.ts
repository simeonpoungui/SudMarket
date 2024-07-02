import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit, Produit } from 'src/app/Models/produit.model';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.scss']
})
export class ProduitComponent {

  dataSource!: any;
  displayedColumns = [
    'nom',
    'description',
    'categorie',
    'prix',
    'quantite_en_stock',
    'niveau_de_reapprovisionnement',
    'Actions'
  ];

  isloadingpage!: boolean
  selectedProduitString: string = ''
  
  constructor(
    private produitService: ProduitService,
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListProduit()
  }

  getListProduit(){
    const produit : GetProduit = {produit_id: 0}
    this.isloadingpage = true
    this.produitService.getList(produit).subscribe(data => {
      console.log(data.message);
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


  actions(element: Produit){
    this.selectedProduitString = JSON.stringify(element); 
    localStorage.setItem('selectedProduit', this.selectedProduitString);
    if (this.selectedProduitString) {
      this.router.navigateByUrl('produit/view')
    }
  }

}
