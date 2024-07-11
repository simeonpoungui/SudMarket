import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { ArticlesCommandesAchatsService } from 'src/app/Services/articles-commandes-achats.service';
import { ArticlesDeCommandeDAchat, GetArticleDeCommandeDAchat } from 'src/app/Models/articles.commandes.achats';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Services/produit.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';

@Component({
  selector: 'app-articles-commandes-achats',
  templateUrl: './articles-commandes-achats.component.html',
  styleUrls: ['./articles-commandes-achats.component.scss']
})
export class ArticlesCommandesAchatsComponent {
  dataSource!: any;
  displayedColumns = [
    'date_commande',
    'produit_id',
    'quantite',
    'prix_unitaire',
    'prix_total_commande',
    'point_de_vente_id',
    'Actions'
  ];
  tbProduit!: Produit[]
  tbPointdeVente!: PointsDeVentes[]
  isloadingpage!: boolean
  selectedcommandeString!: string;
  TotalMontant!:number
  constructor(
    private articlecommandeService: ArticlesCommandesAchatsService,
    private router: Router,
    private produitService: ProduitService,
    public globalService: GlobalService,
    private pointService: PointsDeVentesService,
    private dialog: MatDialog
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListCommandes()
    this.loadProduit()
    this.loadPointDeVente()
  }

  loadProduit(){
    const produit : GetProduit = {produit_id: 0}
    this.produitService.getList(produit).subscribe(data => {
      console.log(data.message);
      this.tbProduit = data.message
      console.log(this.tbProduit);
      
    })
  }


  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
      
    } )
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
  }

  getProduitName(produit_id: number): string {
    const produit = this.tbProduit.find(p => p.produit_id === produit_id);
    return produit ? (produit.nom ): '';
  }
  
  getListCommandes(){
    const article : GetArticleDeCommandeDAchat = {article_commande_achat_id: 0}
    this.isloadingpage = true
    this.articlecommandeService.getList(article).subscribe(data => {
      console.log(data.message); 
      this.TotalMontant = this.globalService.calculTotal('prix_total_commande', data.message);
    
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
