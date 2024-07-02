import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { ArticlesCommandesAchatsService } from 'src/app/Services/articles-commandes-achats.service';
import { ArticlesDeCommandeDAchat, GetArticleDeCommandeDAchat } from 'src/app/Models/articles.commandes.achats';

@Component({
  selector: 'app-articles-commandes-achats',
  templateUrl: './articles-commandes-achats.component.html',
  styleUrls: ['./articles-commandes-achats.component.scss']
})
export class ArticlesCommandesAchatsComponent {
  dataSource!: any;
  displayedColumns = [
    'commande_achat_id',
    'produit_id',
    'quantite',
    'prix_unitaire',
    'Actions'
  ];

  isloadingpage!: boolean
  selectedcommandeString!: string;

  constructor(
    private articlecommandeService: ArticlesCommandesAchatsService,
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListCommandes()
  }
  
  getListCommandes(){
    const article : GetArticleDeCommandeDAchat = {article_commande_achat_id: 0}
    this.isloadingpage = true
    this.articlecommandeService.getList(article).subscribe(data => {
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

  actions(element: ArticlesDeCommandeDAchat){
    this.selectedcommandeString = JSON.stringify(element); 
    localStorage.setItem('selectedVente', this.selectedcommandeString);
    if (this.selectedcommandeString) {
      this.router.navigateByUrl('article/view')
    }
  }
}
