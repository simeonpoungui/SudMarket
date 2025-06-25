import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GetArticleDeVente } from 'src/app/Models/articlesDeVente.model';
import { GetCommandeAchat } from 'src/app/Models/commande.model';
import { GetDepense } from 'src/app/Models/depenses.model';
import { Utilisateur } from 'src/app/Models/users.model';
import { GetVente } from 'src/app/Models/vente.model';
import { ArticlesDeVenteService } from 'src/app/Services/articles-de-vente.service';
import { CommandeService } from 'src/app/Services/commande.service';
import { DepensesService } from 'src/app/Services/depenses.service';
import { GlobalService } from 'src/app/Services/global.service';
import { RapportService } from 'src/app/Services/rapport.service';
import { VenteService } from 'src/app/Services/vente.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent {


  constructor(
    private rapportService: RapportService,
    private router: Router,
    private venteService: VenteService,
    private dialog: MatDialog,
    private commandeService: CommandeService,
    private depenseService: DepensesService,
    private route: ActivatedRoute,
    private articleService: ArticlesDeVenteService,
    public globalService: GlobalService
  ) {}

    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

  }



  //   getListArticles(){
  //     const article : GetArticleDeVente = {article_de_vente_id: 0}
  //     this.articleService.getList(article).subscribe(data => {
  //       console.log(data.message);
  //      });
  //   }

  // getDepenses() {
  //   const depense: GetDepense = { id_depense: 0 };
  //   this.depenseService.getListDepenses(depense).subscribe((data) => {
  //     console.log(data.message);
  //   });
  // }

  // getListCommandes() {
  //   const commande: GetCommandeAchat = { commande_achat_id: 0 };
  //   this.commandeService.getList(commande).subscribe((data) => {
  //     console.log(data.message);
  //   });
  // }
}
