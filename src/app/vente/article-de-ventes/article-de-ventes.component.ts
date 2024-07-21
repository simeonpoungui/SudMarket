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
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';

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
    'point_de_vente_id',
    'Actions'
  ];
  isloadingpage!: boolean;
  tbVente!: any[]
  tbProduit!: Produit[]
  table!: any
  MontantTotalVengteJournalier!: number
  tbPointdeVente!: PointsDeVentes[]
  articlesventes!: ArticlesDeVentes[]
  DateDebutVente!: string
  dateFinVente!: string 
  pointdevetents!: PointsDeVentes[]
  selectedArticleString!: string;

  IDproduit!: number
  IDpoint!: number

  constructor(
    public globalService: GlobalService,
    private venteService: VenteService,
    private router: Router,
    private produitService: ProduitService,
    private pointService: PointsDeVentesService,
    private articleService: ArticlesDeVenteService
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListArticles()
    this.loadProduit()
    this.loadVente()
    this.loadPointDeVente()
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
      this.table = data.message
      this.articlesventes = this.table
      this.MontantTotalVengteJournalier = this.globalService.calculTotal('prix_total_vente', data.message);
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
    this.IDproduit = Number(event.target.value)
    this.articleService.getArticlesDeVentesByDateDebutFin(this.IDproduit,this.IDpoint,this.DateDebutVente,this.dateFinVente).subscribe(data => {
      console.log(data);
      this.table = data.message
      this.articlesventes = this.table
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
        this.MontantTotalVengteJournalier = 0
        this.globalService.toastShow('Aucun article vendu','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(this.table);
        this.MontantTotalVengteJournalier = this.globalService.calculTotal('prix_total_vente', this.table);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  SelectPointDeVente(event: any){
    console.log(event.target.value);
   this.IDpoint = Number(event.target.value)
   this.articleService.getArticlesDeVentesByDateDebutFin(this.IDproduit,this.IDpoint,this.DateDebutVente,this.dateFinVente).subscribe(data => {
    console.log(data);
    this.table = data.message
    this.articlesventes = this.table
    if (typeof data.message === 'string') {
      this.dataSource = new MatTableDataSource([])
      this.MontantTotalVengteJournalier = 0
      this.globalService.toastShow('Aucun article vendu','Information','info')
    }else {
      this.dataSource = new MatTableDataSource(this.table);
      this.MontantTotalVengteJournalier = this.globalService.calculTotal('prix_total_vente', this.table);
    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  })
  }

  selectDateDebut(event: any) {
    this.DateDebutVente = event.target.value;
    console.log(this.DateDebutVente);
    this.articleService.getArticlesDeVentesByDateDebutFin(this.IDproduit,this.IDpoint,this.DateDebutVente,this.dateFinVente).subscribe(data => {
      console.log(data.message);
      this.table = data.message
      this.articlesventes = this.table
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
        this.MontantTotalVengteJournalier = 0
        this.globalService.toastShow('Aucun article vendu','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(this.table);
        this.MontantTotalVengteJournalier = this.globalService.calculTotal('prix_total_vente', this.table);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  selectDateFin(event: any) {
    this.dateFinVente = event.target.value;
    console.log(this.dateFinVente);
    this.articleService.getArticlesDeVentesByDateDebutFin(this.IDproduit,this.IDpoint,this.DateDebutVente,this.dateFinVente).subscribe(data => {
      console.log(data);
      this.table = data.message
      this.articlesventes = this.table
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
        this.MontantTotalVengteJournalier = 0
        this.globalService.toastShow('Aucun article vendu','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(this.table);
        this.MontantTotalVengteJournalier = this.globalService.calculTotal('prix_total_vente', this.table);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }
  

  actions(element: ArticlesDeVentes){
     this.selectedArticleString = JSON.stringify(element); 
     localStorage.setItem('selectedArticle', this.selectedArticleString);
     if (this.selectedArticleString) {
       this.router.navigateByUrl('article/view')
    }
  }

  imprimer() {
    this.articleService.getListAticleDeVentesEtatPDF(this.articlesventes).subscribe((data) => {
      console.log(data);
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'Rapport_de_cloture_de_caisse.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      const pdfWindow = window.open('');
      if (pdfWindow) {
        pdfWindow.document.write(
          "<iframe width='100%' height='100%' style='border:none' src='" +
          url +
          "'></iframe>"
        );
      }
    });
  }
}

