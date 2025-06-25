import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Utilisateur } from 'src/app/Models/users.model';
import { DepensesService } from 'src/app/Services/depenses.service';
import { Depense, GetDepense } from 'src/app/Models/depenses.model';

@Component({
  selector: 'app-sous-categorie-depenses',
  templateUrl: './sous-categorie-depenses.component.html',
  styleUrls: ['./sous-categorie-depenses.component.scss']
})
export class SousCategorieDepensesComponent {
  dataSource!: any;
  displayedColumns = [
    'nom_sous_categorie',
    'id_categorie',
    'description',
    'date_creation',
    'Actions'
  ];  

  isloadingpage!: boolean
  selectedFournisseurString: string = ''
  nbrefournisseur: number = 0
  user!: Utilisateur
  TbCatgorie: any[]= []
  
  constructor(
    private depenseService: DepensesService,
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getSousCategoriesDepenses()
    this.loadCatgorie();

  }


  loadCatgorie() {
      this.depenseService.getListCategoriesDepenses(0).subscribe((data) => {
        console.log(data.message);
        this.TbCatgorie = data.message;
      });
    }

    getCatgorieName(id_categorie: any): string {
      const c = this.TbCatgorie.find(
        (p) => p.id_categorie === id_categorie
      );
      return c ? c.nom_categorie : 'Unknown categorie';
    }
  

  getSousCategoriesDepenses(){
    this.isloadingpage = true
    this.depenseService.getListSousCategoriesDepenses(0).subscribe(data => {
      console.log(data.message);
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


  updateCategorie(element: any){
      this.router.navigateByUrl('sous_categorie/edit/'  + element.id_sous_categorie)
  }
}
