import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { ArticlesDeVentes } from 'src/app/Models/vente.model';
import { ArticlesDeVenteService } from 'src/app/Services/articles-de-vente.service';
import { EntrepotService } from 'src/app/Services/entrepot.service';
import { GlobalService } from 'src/app/Services/global.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { ProduitService } from 'src/app/Services/produit.service';
import { VenteService } from 'src/app/Services/vente.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.scss'],
})
export class ProduitsComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  produits: Produit[] = [];
  topArticles: any[] = [];
  topArticlesMarge: any[] = [];
  topArticlesEcoulement: any[] = [];
  imageproduitArticle: { [key: number]: string } = {};

  sortState = {
    topArticles: { column: '', direction: 'desc' },
    topArticlesMarge: { column: '', direction: 'desc' },
    topArticlesEcoulement: { column: '', direction: 'desc' },
  };

  constructor(
    public globalService: GlobalService,
    private articleService: ArticlesDeVenteService,
    private produitService: ProduitService,
    private entrepotService: EntrepotService,
    private venteService: VenteService,
    private pointDeVenteService: PointsDeVentesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    const articleReq = this.articleService.getList({ article_de_vente_id: 0 });
    const produitReq = this.produitService.getList({ produit_id: 0 });

    forkJoin([articleReq, produitReq]).subscribe(([articlesRes, produitsRes]) => {
      const articles = articlesRes.message;
      this.produits = produitsRes.message;

      this.aggregateArticlesByProduitId(articles);
      this.calculateMarginsAndSort(articles);
      this.generateReport(articles);

      this.topArticles.forEach((article) => {
        this.getImageByproduiIDByArticle(article.produit_id);
      });
    });
  }

  aggregateArticlesByProduitId(articles: ArticlesDeVentes[]): void {
    const produitMap = new Map<number, { produit_id: number; quantite: number; chiffreAffaire: number }>();

    for (const article of articles) {
      const id = article.produit_id;
      const quantite = Number(article.quantite);
      const prixUnitaire = Number(article.prix_unitaire);
      const ca = quantite * prixUnitaire;

      const existant = produitMap.get(id);
      if (existant) {
        existant.quantite += quantite;
        existant.chiffreAffaire += ca;
      } else {
        produitMap.set(id, { produit_id: id, quantite, chiffreAffaire: ca });
      }
    }

    this.topArticles = Array.from(produitMap.values()).sort((a, b) => b.quantite - a.quantite);
  }

  calculateMarginsAndSort(articles: ArticlesDeVentes[]): void {
    const result: any[] = [];

    for (const article of articles) {
      const produit = this.produits.find(p => p.produit_id === article.produit_id);
      if (produit) {
        const prixVente = Number(article.prix_unitaire);
        const coutAchat = Number(produit.cout_d_achat);
        const quantiteVendue = Number(article.quantite);

        const margeUnitaire = prixVente - coutAchat;
        const margeTotale = margeUnitaire * quantiteVendue;

        if (!isNaN(margeTotale)) {
          result.push({
            margeUnitaire: margeUnitaire.toFixed(2),
            margeTotale: margeTotale.toFixed(2),
            produit_id: produit.produit_id,
            quantite: quantiteVendue,
            chiffreAffaire: margeTotale.toFixed(2),
          });
        }
      }
    }

    this.topArticlesMarge = result.sort((a, b) => Number(b.margeTotale) - Number(a.margeTotale));
  }

  generateReport(articles: ArticlesDeVentes[]): void {
    const uniqueRequests: { produit_id: number; point_de_vente_id: any }[] = [];
    const seen = new Set<string>();

    for (const article of articles) {
      const key = `${article.produit_id}-${article.point_de_vente_id}`;
      if (!seen.has(key)) {
        uniqueRequests.push({ produit_id: article.produit_id, point_de_vente_id: article.point_de_vente_id });
        seen.add(key);
      }
    }

    const requests = uniqueRequests.map(({ produit_id, point_de_vente_id }) =>
      this.entrepotService.getQuantiteProduitByStockPoint(point_de_vente_id, produit_id).pipe(
        map(res => ({
          produit_id,
          point_de_vente_id,
          stockInitial: res.message?.stock_total_entrant ?? 0,
        }))
      )
    );

    forkJoin(requests).subscribe((stocks) => {
      const result = articles.map(article => {
        const stockInfo = stocks.find(s =>
          s.produit_id === article.produit_id &&
          s.point_de_vente_id === article.point_de_vente_id
        );

        const stockInitial = stockInfo?.stockInitial ?? 0;
        const tauxEcoulement = stockInitial > 0 ? (article.quantite / stockInitial) * 100 : 0;

        return {
          produit_id: article.produit_id,
          quantite: article.quantite,
          tauxEcoulement: tauxEcoulement.toFixed(2),
        };
      });

      this.topArticlesEcoulement = result;
    });
  }

  getImageByproduiIDByArticle(IDproduit: number): void {
    const produit: GetProduit = { produit_id: IDproduit };
    this.produitService.getImageByProduit(produit).subscribe((data) => {
      if (data.message) {
        this.imageproduitArticle[IDproduit] = `${data.message}`;
      } else {
        console.log(`Aucune image trouvée pour le produit ID: ${IDproduit}`);
      }
    });
  }

  getProduitName(produit_id: number): string {
    const produit = this.produits.find((p) => p.produit_id === produit_id);
    return produit ? produit.nom : '';
  }

  sortTable(table: 'topArticles' | 'topArticlesMarge' | 'topArticlesEcoulement', column: string): void {
    const state = this.sortState[table];
    const direction = state.column === column && state.direction === 'asc' ? 'desc' : 'asc';
    state.column = column;
    state.direction = direction;

    const compare = (a: any, b: any) => {
      const valA = Number(a[column]);
      const valB = Number(b[column]);

      if (isNaN(valA) || isNaN(valB)) {
        return direction === 'asc'
          ? String(a[column]).localeCompare(String(b[column]))
          : String(b[column]).localeCompare(String(a[column]));
      }

      return direction === 'asc' ? valA - valB : valB - valA;
    };

    this[table] = [...this[table]].sort(compare);
  }
}
