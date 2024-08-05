import { Component } from '@angular/core';
import { GetVente, Vente } from '../Models/vente.model';
import { VenteService } from '../Services/vente.service';
import { GlobalService } from '../Services/global.service';
import { GetProduit, Produit } from '../Models/produit.model';
import { ProduitService } from '../Services/produit.service';
import { GetUser, Utilisateur } from '../Models/users.model';
import { UsersService } from '../Services/users.service';
import { Client, GetClient } from '../Models/clients.model';
import { ClientsService } from '../Services/clients.service';
import {
  ArticlesDeVentes,
  GetArticleDeVente,
} from '../Models/articlesDeVente.model';
import { ArticlesDeVenteService } from '../Services/articles-de-vente.service';
import { GetPointsDeVentes, PointsDeVentes } from '../Models/pointsDeVentes.model';
import { PointsDeVentesService } from '../Services/points-de-ventes.service';
import { MatDialog } from '@angular/material/dialog';
import { EtatCaisseVendeurComponent } from '../comptabilite/etat-caisse-vendeur/etat-caisse-vendeur.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  ventes!: Vente[];
  produits!: Produit[];
  dernieresVentes: Vente[] = [];
  tbClients!: Client[];
  tbUsers!: Utilisateur[];
  ventesParMois: { [mois: string]: number } = {};
  articles: ArticlesDeVentes[] = [];
  topUsers: any[] = [];
  tbPointdeVente!: PointsDeVentes[]

  moisNoms = [
    'JANV',
    'FÉV',
    'MARS',
    'AVR',
    'MAI',
    'JUIN',
    'JUIL',
    'AOÛT',
    'SEPT',
    'OCT',
    'NOV',
    'DÉC',
  ];
  

  totalVentesJourActuel: number = 0;
  totalVentesJourPrecedent: number = 0;

  totalVentesMoisActuel: number = 0;
  totalVentesMoisPrecedent: number = 0;

  totalVentesAnneeActuelle: number = 0;
  totalVentesAnneePrecedente: number = 0;

  totalProduitsFinis: number = 0;
  totalProduitsRestants: number = 0;

  nombreVentesMoisEnCours: number = 0;
  nombreVentesMoisPrecedent: number = 0;

  constructor(
    public globalService: GlobalService,
    private produitService: ProduitService,
    private venteService: VenteService,
    private userService: UsersService,
    private dialog: MatDialog,
    private pointService: PointsDeVentesService,
    private articleService: ArticlesDeVenteService,
    private clientService: ClientsService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.getListVente();
    this.getListProduit();
    this.getListArticles();
    this.loadClients();
    this.loadVentes();
    this.loadPointDeVente()
  }

  openCaisse(){
    const dialog = this.dialog.open(EtatCaisseVendeurComponent)
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
    const produit = this.produits.find(p => p.produit_id === produit_id);
    return produit ? (produit.nom ): '';
  }

  getVenteName(vente_id: number): string {
    const vente = this.ventes.find(v => v.vente_id === vente_id);
    return vente ? this.globalService.formatDate(vente.date_vente): '';
  }

  getUserName(utilisateur_id: number): string {
    const user = this.tbUsers.find(u => u.utilisateur_id === utilisateur_id);
    return user ? user.nom_utilisateur: '';
  }

  getClientsName(client_id: number): string {
    const client = this.tbClients.find(c => c.client_id === client_id);
    return client ? client.nom: '';
  }

  getListArticles(): void {
    const article: GetArticleDeVente = { article_de_vente_id: 0 };
    this.articleService.getList(article).subscribe((data) => {
      this.articles = data.message;
      console.log(this.articles);
      this.articles = this.articles
        .sort((a, b) => b.quantite - a.quantite)
        .slice(0, 10);
    });
  }

  loadClients(): void {
    const client: GetClient = {
      client_id: 0,
    };
    this.clientService.getListClient(client).subscribe((data: any) => {
      this.tbClients = data.message.slice(0, 10);
    });
  }

  loadUsers(): void {
    const user: GetUser = {
      utilisateur_id: 0,
    };
    this.userService.getListUser(user).subscribe((data: any) => {
      this.tbUsers = data.message;
    });
  }

  getListVente() {
    const vente: GetVente = { vente_id: 0 };
    this.venteService.getList(vente).subscribe((data) => {
      this.ventes = data.message;
      this.calculerTotauxVentes();
      this.calculerTotauxVentesAnnuelle();
      this.calculerVentesMoisEnCours();
      this.calculerVentesMoisPrecedent()
      this.getDernieresVentes();
      this.afficherGraphique();
    });
  }

  getListProduit() {
    const produit: GetProduit = { produit_id: 0 };
    this.produitService.getList(produit).subscribe((data) => {
      console.log(data.message);
      this.produits = data.message;
    });
  }

  calculerTotauxVentes() {
    const aujourdhui = new Date();
    const hier = new Date();
    hier.setDate(aujourdhui.getDate() - 1);

    const moisActuel = aujourdhui.getMonth();
    const anneeActuelle = aujourdhui.getFullYear();
    const moisPrecedent = moisActuel === 0 ? 11 : moisActuel - 1;
    const anneePrecedente =
      moisActuel === 0 ? anneeActuelle - 1 : anneeActuelle;

    this.totalVentesJourActuel = this.ventes
      .filter(
        (vente) =>
          new Date(vente.date_vente).toDateString() ===
          aujourdhui.toDateString()
      )
      .reduce((total, vente) => total + Number(vente.montant_total), 0);

    this.totalVentesJourPrecedent = this.ventes
      .filter(
        (vente) =>
          new Date(vente.date_vente).toDateString() === hier.toDateString()
      )
      .reduce((total, vente) => total + Number(vente.montant_total), 0);

    this.totalVentesMoisActuel = this.ventes
      .filter((vente) => {
        const dateVente = new Date(vente.date_vente);
        return (
          dateVente.getMonth() === moisActuel &&
          dateVente.getFullYear() === anneeActuelle
        );
      })
      .reduce((total, vente) => total + Number(vente.montant_total), 0);

    this.totalVentesMoisPrecedent = this.ventes
      .filter((vente) => {
        const dateVente = new Date(vente.date_vente);
        return (
          dateVente.getMonth() === moisPrecedent &&
          dateVente.getFullYear() === anneePrecedente
        );
      })
      .reduce((total, vente) => total + Number(vente.montant_total), 0);
  }

  calculerTotauxVentesAnnuelle() {
    const aujourdhui = new Date();
    const anneeActuelle = aujourdhui.getFullYear();
    const anneePrecedente = anneeActuelle - 1;

    this.totalVentesAnneeActuelle = this.ventes
      .filter(
        (vente) => new Date(vente.date_vente).getFullYear() === anneeActuelle
      )
      .reduce((total, vente) => total + Number(vente.montant_total), 0);

    this.totalVentesAnneePrecedente = this.ventes
      .filter(
        (vente) => new Date(vente.date_vente).getFullYear() === anneePrecedente
      )
      .reduce((total, vente) => total + Number(vente.montant_total), 0);
  }

  calculerVentesMoisEnCours() {
    const moisEnCours = new Date().getMonth();
    const anneeEnCours = new Date().getFullYear();

    this.ventes.forEach((vente) => {
      const dateVente = new Date(vente.date_vente);
      if (
        dateVente.getMonth() === moisEnCours &&
        dateVente.getFullYear() === anneeEnCours
      ) {
        this.nombreVentesMoisEnCours++;
      }
    });
  }

  calculerVentesMoisPrecedent() {
    const moisPrecedent = new Date().getMonth() - 1;
    const anneeEnCours = new Date().getFullYear();

    this.ventes.forEach((vente) => {
      const dateVente = new Date(vente.date_vente);
      if (
        dateVente.getMonth() === moisPrecedent &&
        dateVente.getFullYear() === anneeEnCours
      ) {
        this.nombreVentesMoisPrecedent++;
      }
    });
  }

  getDernieresVentes() {
    this.ventes.sort(
      (a, b) =>
        new Date(b.date_vente).getTime() - new Date(a.date_vente).getTime()
    );
    this.dernieresVentes = this.ventes.slice(0, 10);
  }

  loadVentes(): void {
    const vente: GetVente = { vente_id: 0 };
    this.venteService.getList(vente).subscribe((data: any) => {
      if (!data || !data.message) {
        console.error('Les données des ventes sont manquantes ou invalides');
        return;
      }
      const ventes = data.message as any[]; 
      const userVentesMap = new Map<number, number>();
      ventes.forEach((vente: any) => {
        const userId = vente.utilisateur_id;
        if (userId !== undefined) {
          if (userVentesMap.has(userId)) {
            userVentesMap.set(userId, userVentesMap.get(userId)! + 1);
          } else {
            userVentesMap.set(userId, 1);
          }
        }
      });
      this.topUsers = Array.from(userVentesMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([userId, ventesCount]) => {
          const user = this.tbUsers.find((u) => u.utilisateur_id === userId);
          return user
            ? { ...user, ventesCount }
            : { utilisateur_id: userId, ventesCount };
        });
    });
  }

  afficherGraphique() {
    const montantsParMois = Array(12).fill(0);
    this.ventes.forEach((vente) => {
      const dateVente = new Date(vente.date_vente);
      if (dateVente.getFullYear() === new Date().getFullYear()) {
        const moisIndex = dateVente.getMonth();
        montantsParMois[moisIndex] += Number(vente.montant_total);
      }
    });

    const montantsParMoisFormatted = montantsParMois.map((montant) => `${montant.toFixed(2)} FCFA`);
  console.log(montantsParMoisFormatted);
  
    const chart = new ApexCharts(
      document.querySelector('#payment-records-chart2'),
      {
        chart: {
          height: 380,
          width: '100%',
          stacked: false,
          toolbar: { show: false },
        },
        stroke: { width: [1], curve: 'smooth', lineCap: 'round' },
        plotOptions: { bar: { endingShape: 'rounded', columnWidth: '10%' } },
        colors: ['#3454d1'],
        series: [
          {
            name: 'Ventes Totales',
            type: 'bar',
            data: montantsParMoisFormatted,
          },
        ],
        fill: {
          opacity: [0.85],
          gradient: {
            inverseColors: false,
            shade: 'light',
            type: 'vertical',
            opacityFrom: 0.5,
            opacityTo: 0.1,
            stops: [0, 100, 100, 100],
          },
        },
        markers: { size: 0 },
        xaxis: {
          categories: this.moisNoms.map(mois => mois + '/24'),
          axisBorder: { show: false },
          axisTicks: { show: false }, 
          labels: { style: { fontSize: '10px', colors: '#A0ACBB' } },
        },
        yaxis: {
          labels: {
            formatter: function (e: string | number) {
              return +e; // Affiche les valeurs sans suffixe
            },
            offsetX: -5,
            offsetY: 0,
            style: { color: '#A0ACBB' },
          },
        },
        grid: {
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: false } },
        },
        dataLabels: { enabled: false },
        tooltip: {
          y: {
            formatter: function (e: string | number) {
              return +e; // Affiche les valeurs sans suffixe
            },
          },
          style: { fontSize: '12px', fontFamily: 'Inter' },
        },
        legend: {
          show: false,
          labels: { fontSize: '12px', colors: '#A0ACBB' },
          fontSize: '12px',
          fontFamily: 'Inter',
        },
      }
    );

    chart.render();
  }
}
