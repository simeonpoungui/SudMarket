import { Component,ViewChild } from '@angular/core';
import { ArticlesDeVenteService } from 'src/app/Services/articles-de-vente.service';
import { GlobalService } from 'src/app/Services/global.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ArticlesDeVentes, GetArticleDeVente } from 'src/app/Models/articlesDeVente.model';
import { GetVente, Vente, VenteArticle } from 'src/app/Models/vente.model';
import { VenteService } from 'src/app/Services/vente.service';
import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit, Produit } from 'src/app/Models/produit.model';

@Component({
  selector: 'app-article-de-ventes',
  templateUrl: './article-de-ventes.component.html',
  styleUrls: ['./article-de-ventes.component.scss']
})
export class ArticleDeVentesComponent {
  dataSource!: any;
  displayedColumns = [
    'date_article_vendu',
    'produit_id',
    'quantite',
    'prix_unitaire',
    'prix_total_vente',
    'remise',
    'Actions'
  ];
  isloadingpage!: boolean;
  tbVente!: any[]
  tbProduit!: Produit[]
  table!: any

  DateDebutVente!: string
  dateFinVente!: string

  constructor(
    public globalService: GlobalService,
    private venteService: VenteService,
    private produitService: ProduitService,
    private articleService: ArticlesDeVenteService
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListArticles()
    this.loadProduit()
    this.loadVente()
  }

  loadVente(){
    const vente : GetVente = {vente_id: 0}
    this.venteService.getList(vente).subscribe(data => {
      console.log(data.message);
      this.tbVente = data.message
    })
  }

  loadProduit(){
    const produit : GetProduit = {produit_id: 0}
    this.produitService.getList(produit).subscribe(data => {
      console.log(data.message);
      this.tbProduit = data.message
    })
  }

  getVenteName(vente_id: number): string {
    const vente = this.tbVente.find(v => v.vente_id === vente_id);
    return vente ? this.globalService.formatDate(vente.date_vente): '';
  }
  
  getProduitName(produit_id: number): string {
    const produit = this.tbProduit.find(p => p.produit_id === produit_id);
    return produit ? (produit.nom ): '';
  }

  getListArticles(){
    const article : GetArticleDeVente = {article_de_vente_id: 0}
    this.isloadingpage = true
    this.articleService.getList(article).subscribe(data => {
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

  SelectProduit(event: any){
    console.log(event.target.value);
    const produit: GetProduit = {
      produit_id: Number(event.target.value)
    }
    this.articleService.getArticlesDeVentesByProduit(produit).subscribe(data => {
      console.log(data);
      this.table = data.message
      this.dataSource = new MatTableDataSource(this.table);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;}
  )
  }

  selectDateDebut(event: any) {
    this.DateDebutVente = event.target.value;
    console.log(this.DateDebutVente);
    this.articleService.getArticlesDeVentesByDateDebutFin(this.DateDebutVente, this.dateFinVente).subscribe(data => {
      console.log(data.message);
      this.table = data.message
      this.dataSource = new MatTableDataSource(this.table);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  selectDateFin(event: any) {
    this.dateFinVente = event.target.value;
    console.log(this.dateFinVente);
    this.articleService.getArticlesDeVentesByDateDebutFin(this.DateDebutVente, this.dateFinVente).subscribe(data => {
      console.log(data.message);
      this.table = data.message
      this.dataSource = new MatTableDataSource(this.table);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }
  

  actions(element: ArticlesDeVentes){
    // this.selectedVenteString = JSON.stringify(element); 
    // localStorage.setItem('selectedVente', this.selectedVenteString);
    // if (this.selectedVenteString) {
    //   this.router.navigateByUrl('vente/view')
    }
  }


