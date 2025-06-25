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
  selector: 'app-categorie-depenses',
  templateUrl: './categorie-depenses.component.html',
  styleUrls: ['./categorie-depenses.component.scss']
})
export class CategorieDepensesComponent {
  dataSource!: any;
  displayedColumns = [
    'nom_categorie',
    'description',
    'date_creation',
    'Actions'
  ];  

  isloadingpage!: boolean
  selectedFournisseurString: string = ''
  nbrefournisseur: number = 0
  user!: Utilisateur
  TbCategorie: any[]=[]
  TbSousCategorie: any[] = []; 
  categoriesAvecSousCategories: any[] = []; // Tableau pour associer les sous-catégories aux catégories

  constructor(
    private depenseService: DepensesService,
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getCategoriesDepenses()
    this.getSousCategoriesDepenses()

  }

  // Récupération des catégories
  getCategoriesDepenses() {
    this.isloadingpage = true;
    this.depenseService.getListCategoriesDepenses(0).subscribe(data => {
      this.TbCategorie = data.message;
      this.isloadingpage = false;
      this.associerSousCategoriesAuxCategories(); // Appel pour associer les sous-catégories aux catégories
    });
  }

  // Récupération des sous-catégories
  getSousCategoriesDepenses() {
    this.isloadingpage = true;
    this.depenseService.getListSousCategoriesDepenses(0).subscribe(data => {
      this.TbSousCategorie = data.message;
      this.isloadingpage = false;
      this.associerSousCategoriesAuxCategories(); // Appel pour associer les sous-catégories aux catégories
    });
  }

  // Fonction pour associer les sous-catégories à leurs catégories respectives
  associerSousCategoriesAuxCategories() {
    this.categoriesAvecSousCategories = this.TbCategorie.map(categorie => {
      return {
        ...categorie,
        sousCategories: this.TbSousCategorie.filter(sousCategorie => sousCategorie.id_categorie === categorie.id_categorie)
      };
    });
  }

    // Méthode pour gérer le clic sur une catégorie
    onCategoryClick(categoryId: any) {
      this.router.navigateByUrl('categorie/edit/'  + categoryId.id_categorie)
    }
  
    // Méthode pour gérer le clic sur une sous-catégorie
    onSubCategoryClick(subCategoryId: any) {
      this.router.navigateByUrl('sous_categorie/edit/'  + subCategoryId.id_sous_categorie)
    }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }


  updateCategorie(element: any){
      this.router.navigateByUrl('categorie/edit/'  + element.id_categorie)
  }
}
