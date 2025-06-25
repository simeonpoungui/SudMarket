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
import {
  GetPointsDeVentes,
  PointsDeVentes,
} from '../Models/pointsDeVentes.model';
import { PointsDeVentesService } from '../Services/points-de-ventes.service';
import { MatDialog } from '@angular/material/dialog';
import { EtatCaisseVendeurComponent } from '../comptabilite/etat-caisse-vendeur/etat-caisse-vendeur.component';
import { EntrepotService } from '../Services/entrepot.service';
import { Entrepot } from '../Models/entrepot.model';
import { DepensesService } from '../Services/depenses.service';
import { Depense } from '../Models/depenses.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  dateFin: any;
  comparateur: string = 'Mois';
  dateDebut: any;
  beneficeNet!: number;

  ventes: Vente[] = [];
  ventesFilter: Vente[] = [];
  TbStockproduits: any[] = [];
  dernieresVentes: Vente[] = [];
  tbClients: Client[] = [];
  tbClientsFilter: Client[] = [];
  tbUsers: Utilisateur[] = [];
  ventesParMois: { [mois: string]: number } = {};
  articles: ArticlesDeVentes[] = [];
  tbBenefices: ArticlesDeVentes[] = [];
  topUsers: any[] = [];
  tbPointdeVente: PointsDeVentes[] = [];
  tbDepenses: Depense[] = [];
  tbDepensesFilter: Depense[] = [];

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

  totalVentesJourActuel = 0;
  totalVentesJourPrecedent = 0;
  totalVentesMoisActuel = 0;
  totalVentesMoisPrecedent = 0;
  totalVentesAnneeActuelle = 0;
  totalVentesAnneePrecedente = 0;
  totalProduitsFinis = 0;
  totalProduitsRestants = 0;
  totalNombreVente: number = 0;
  totalNombreClient: number = 0;
  nombreVentesMoisEnCours = 0;
  nombreVentesMoisPrecedent = 0;

  user!: Utilisateur;
  isloadingproduit = false;

  imageproduit: { [key: number]: string } = {};
  imageUsers: { [key: number]: string } = {};
  imageproduitArticle: { [key: number]: string } = {};

  point_de_vente_id: number = 0;
  chiffreAffaire: number = 0;
  
precedentNombreVente: number = 0;
precedentNombreClient: number = 0;
precedentChiffreAffaire: number = 0;
precedentBeneficeNet: number = 0;
precedentDepenses: Depense[] = [];
ventesPrecedentes: Vente[] = []


  constructor(
    public globalService: GlobalService,
    private produitService: ProduitService,
    private venteService: VenteService,
    private userService: UsersService,
    private depenseService: DepensesService,
    private dialog: MatDialog,
    private entrepotService: EntrepotService,
    private pointService: PointsDeVentesService,
    private articleService: ArticlesDeVenteService,
    private clientService: ClientsService
  ) {}

  ngOnInit(): void {
    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user = JSON.parse(utilisateurJson);
    }

    const stored = localStorage.getItem('selectedPoint');
    if (stored) {
      const pointId = parseInt(stored, 10);
      this.point_de_vente_id = pointId;
      console.log(pointId);
    }

    console.log(this.point_de_vente_id);

    this.getStockByPointDeVente(
      this.point_de_vente_id ? this.point_de_vente_id : 0
    );
    this.getArticlesByPointDeVente(
      this.point_de_vente_id ? this.point_de_vente_id : 0
    );
    this.getVenteByPointDeVente(
      this.point_de_vente_id ? this.point_de_vente_id : 0
    );
    this.loadClients(this.point_de_vente_id ? this.point_de_vente_id : 0);
    this.getDepense(this.point_de_vente_id ? this.point_de_vente_id : 0);

    this.loadPointDeVente();
    this.loadUsers();
    this.loadVentes();
  }

  getDepense(point_de_vente_id: number) {
    this.depenseService
      .getFilteredDepensesBypointDeVente(point_de_vente_id)
      .subscribe((res) => {
        console.log(res.message);
        this.comparateur = 'Mois';
        this.applyDepenseFilters();
      });
  }

  loadClients(point_de_vente_id: number): void {
    this.clientService.getFiltreClientByPointDeVente(point_de_vente_id)
      .subscribe((res: any) => {
        console.log(res.message);
        this.comparateur = 'Mois';
        this.tbClientsFilter = res.message
        this.tbClients = res.message
        this.applyClientsFilters();
      });
  }

  getStockByPointDeVente(point_de_vente_id: number) {
    this.entrepotService.getListStockPointDeVente(point_de_vente_id).subscribe({
      next: (data) => {
        console.log(data.message);

        this.TbStockproduits = Array.isArray(data.message) ? data.message : [];
        this.TbStockproduits.forEach((p) =>
          this.fetchImage(p.produit_id, 'produit', this.imageproduit)
        );
        this.isloadingproduit = false;
      },
      error: (err) => {
        console.error('Erreur chargement TbStockproduits:', err);
        this.isloadingproduit = false;
        this.TbStockproduits = [];
      },
    });
  }

  getVenteByPointDeVente(point_de_vente_id: number) {
    this.venteService
      .getVenteByPointDeVente(point_de_vente_id)
      .subscribe((res) => {
        console.log(res.message);
        this.ventes = res.message;
        this.applyFiltersVentes();
        this.getDernieresVentes();
      });
  }

calculerBeneficesNets(
  filteredVentes: any,
  filteredDepenses: any,
  isPrevious: boolean = false
) {
  if (filteredVentes && filteredDepenses) {
    const ventesTotales = filteredVentes.reduce(
      (total: number, vente: any) =>
        total + parseFloat(vente.montant_total || '0'),
      0
    );

    const depensesTotales = filteredDepenses.reduce(
      (total: number, depense: any) =>
        total + parseFloat(depense.montant || '0'),
      0
    );

    const beneficesNets = ventesTotales - depensesTotales;

    if (isPrevious) {
      this.precedentBeneficeNet = beneficesNets;
    } else {
      this.beneficeNet = beneficesNets;
    }
  }
}


  getArticlesByPointDeVente(point_de_vente_id: number) {
    this.articleService.getArticlesDeVentesByPointDeVente(point_de_vente_id).subscribe((res) => {
        console.log(res.message);
        this.articles = res.message;
        this.comparateur = 'Mois'
        this.applyFiltersArticles()
        this.tbBenefices = res.message;
        console.log(this.tbBenefices);
        this.tbBenefices.forEach((article) => {
          this.fetchImage(
            article.produit_id,
            'produit',
            this.imageproduitArticle
          );
        });

        this.articles = this.articles
          // .sort((a, b) => b.quantite - a.quantite)
          // .slice(0, 10);
      });
  }

onFilterChange() {
  this.applyFiltersVentes();
  this.applyPreviousVentes();

  this.applyDepenseFilters();
  this.applyPreviousDepenses();

  this.applyClientsFilters();
  this.applyPreviousClients();
}

applyFiltersArticles() {
  let filtered = [...this.articles]; // Liste d'articles à filtrer
  const now = new Date();

  switch (this.comparateur) {
    case 'Jour':
      filtered = filtered.filter((a) =>
        this.isSameDate(new Date(a.date_article_vendu), now)
      );
      break;

    case 'Semaine': {
      const start = this.getStartOfThisWeek();
      const end = this.getEndOfThisWeek();
      filtered = filtered.filter((a) => {
        const d = new Date(a.date_article_vendu);
        return d >= start && d <= end;
      });
      break;
    }

    case 'Mois': {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      filtered = filtered.filter((a) => {
        const d = new Date(a.date_article_vendu);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
      break;
    }

    case 'Annee':
      filtered = filtered.filter((a) =>
        this.isSameYear(new Date(a.date_article_vendu), now)
      );
      break;
  }

  console.log('Articles filtrés :', filtered);
  this.afficherGraphiqueBeneficesParJour(filtered);
}


  applyFiltersVentes() {
    let filtered = [...this.ventes];
    console.log(filtered);

    // Appliquer les filtres par comparateur
    const now = new Date();
    switch (this.comparateur) {
      case 'Jour':
        filtered = filtered.filter((v) =>
          this.isSameDate(new Date(v.date_vente), now)
        );
        break;

      case 'Semaine': {
        const start = this.getStartOfThisWeek();
        const end = this.getEndOfThisWeek();
        filtered = filtered.filter(
          (v) =>
            new Date(v.date_vente) >= start && new Date(v.date_vente) <= end
        );
        break;
      }

      case 'Mois': {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        filtered = filtered.filter((v) => {
          const d = new Date(v.date_vente);
          return (
            d.getMonth() === currentMonth && d.getFullYear() === currentYear
          );
        });
        break;
      }

      case 'Annee': {
        const start = this.getStartOfThisWeek();
        const end = this.getEndOfThisWeek();
        filtered = filtered.filter((v) =>
          this.isSameYear(new Date(v.date_vente), now)
        );
        break;
      }
    }

    console.log(filtered);
    this.totalNombreVente = filtered.length;

    // Calcul du chiffre d'affaires
    this.chiffreAffaire = filtered.reduce((total, vente) => {
      return total + Number(vente.montant_total || '0');
    }, 0);
    this.totalNombreVente = filtered.length;
    this.calculerBeneficesNets(filtered, this.tbDepenses);
    this.afficherGraphique(filtered);
  }

  applyDepenseFilters() {
    let filtered = [...this.tbDepenses];
    console.log(filtered);

    // Appliquer les filtres par comparateur
    const now = new Date();
    switch (this.comparateur) {
      case 'Jour':
        filtered = filtered.filter((v) =>
          this.isSameDate(new Date(v.date_heure), now)
        );
        break;

      case 'Semaine': {
        const start = this.getStartOfThisWeek();
        const end = this.getEndOfThisWeek();
        filtered = filtered.filter(
          (v) =>
            new Date(v.date_heure) >= start && new Date(v.date_heure) <= end
        );
        break;
      }

      case 'Mois': {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        filtered = filtered.filter((v) => {
          const d = new Date(v.date_heure);
          return (
            d.getMonth() === currentMonth && d.getFullYear() === currentYear
          );
        });
        break;
      }

      case 'Annee': {
        const start = this.getStartOfThisWeek();
        const end = this.getEndOfThisWeek();
        filtered = filtered.filter((v) =>
          this.isSameYear(new Date(v.date_heure), now)
        );
        break;
      }
    }
    console.log(filtered);
    this.tbDepenses = filtered;
    this.calculerBeneficesNets(this.ventesFilter, filtered);
  }

  applyClientsFilters() {
    let filtered = [...this.tbClientsFilter];
    console.log(filtered);

    // Appliquer les filtres par comparateur
    const now = new Date();
    switch (this.comparateur) {
      case 'Jour':
        filtered = filtered.filter((v) =>
          this.isSameDate(new Date(v.cree_le), now)
        );
        break;

      case 'Semaine': {
        const start = this.getStartOfThisWeek();
        const end = this.getEndOfThisWeek();
        filtered = filtered.filter(
          (v) => new Date(v.cree_le) >= start && new Date(v.cree_le) <= end
        );
        break;
      }

      case 'Mois': {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        filtered = filtered.filter((v) => {
          const d = new Date(v.cree_le);
          return (
            d.getMonth() === currentMonth && d.getFullYear() === currentYear
          );
        });
        break;
      }

      case 'Annee': {
        const start = this.getStartOfThisWeek();
        const end = this.getEndOfThisWeek();
        filtered = filtered.filter((v) =>
          this.isSameYear(new Date(v.cree_le), now)
        );
        break;
      }
    }
    console.log(filtered);
    this.totalNombreClient = filtered.length;
  }

  applyPreviousVentes() {
  let filtered = [...this.ventes];
  const now = new Date();

  switch (this.comparateur) {
    case 'Jour': {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      filtered = filtered.filter((v) =>
        this.isSameDate(new Date(v.date_vente), yesterday)
      );
      break;
    }

    case 'Semaine': {
      const start = this.getStartOfLastWeek();
      const end = this.getEndOfLastWeek();
      filtered = filtered.filter((v) =>
        new Date(v.date_vente) >= start && new Date(v.date_vente) <= end
      );
      break;
    }

    case 'Mois': {
      const d = new Date();
      const previousMonth = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      filtered = filtered.filter((v) => {
        const dv = new Date(v.date_vente);
        return (
          dv.getMonth() === previousMonth.getMonth() &&
          dv.getFullYear() === previousMonth.getFullYear()
        );
      });
      break;
    }

    case 'Annee': {
      const previousYear = now.getFullYear() - 1;
      filtered = filtered.filter(
        (v) => new Date(v.date_vente).getFullYear() === previousYear
      );
      break;
    }
  }

  this.precedentNombreVente = filtered.length;
  this.precedentChiffreAffaire = filtered.reduce((total, vente) => {
    return total + Number(vente.montant_total || '0');
  }, 0);

  this.calculerBeneficesNets(filtered, this.tbDepenses, true);
  }

applyPreviousClients() {
  let filtered = [...this.tbClientsFilter];
  const now = new Date();

  switch (this.comparateur) {
    case 'Jour': {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      filtered = filtered.filter((v) =>
        this.isSameDate(new Date(v.cree_le), yesterday)
      );
      break;
    }

    case 'Semaine': {
      const start = this.getStartOfLastWeek();
      const end = this.getEndOfLastWeek();
      filtered = filtered.filter(
        (v) =>
          new Date(v.cree_le) >= start && new Date(v.cree_le) <= end
      );
      break;
    }

    case 'Mois': {
      const d = new Date();
      const previousMonth = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      filtered = filtered.filter((v) => {
        const dv = new Date(v.cree_le);
        return (
          dv.getMonth() === previousMonth.getMonth() &&
          dv.getFullYear() === previousMonth.getFullYear()
        );
      });
      break;
    }

    case 'Annee': {
      const previousYear = now.getFullYear() - 1;
      filtered = filtered.filter(
        (v) => new Date(v.cree_le).getFullYear() === previousYear
      );
      break;
    }
  }

  this.precedentNombreClient = filtered.length;
}

applyPreviousDepenses() {
  let filtered = [...this.tbDepenses]; 
  const now = new Date();

  switch (this.comparateur) {
    case 'Jour': {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      filtered = filtered.filter((v) =>
        this.isSameDate(new Date(v.date_heure), yesterday)
      );
      break;
    }

    case 'Semaine': {
      const start = this.getStartOfLastWeek();
      const end = this.getEndOfLastWeek();
      filtered = filtered.filter(
        (v) =>
          new Date(v.date_heure) >= start &&
          new Date(v.date_heure) <= end
      );
      break;
    }

    case 'Mois': {
      const d = new Date();
      const previousMonth = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      filtered = filtered.filter((v) => {
        const dv = new Date(v.date_heure);
        return (
          dv.getMonth() === previousMonth.getMonth() &&
          dv.getFullYear() === previousMonth.getFullYear()
        );
      });
      break;
    }

    case 'Annee': {
      const previousYear = now.getFullYear() - 1;
      filtered = filtered.filter(
        (v) => new Date(v.date_heure).getFullYear() === previousYear
      );
      break;
    }
  }

  this.precedentDepenses = filtered;

  // Recalcul du bénéfice net précédent avec les ventes déjà filtrées
  this.calculerBeneficesNets(this.ventesPrecedentes, filtered, true);
}
  getListProduit() {
    this.isloadingproduit = true;
    const produit: GetProduit = { produit_id: 0 };
    this.produitService.getList(produit).subscribe({});
  }

  openCaisse() {
    this.dialog.open(EtatCaisseVendeurComponent);
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      this.tbPointdeVente = data.message;
    });
  }

  getPointName(id?: number): string {
    const point = this.tbPointdeVente.find((p) => p.point_de_vente_id === id);
    return point ? point.nom : 'Unknown';
  }

  getProduitName(id: number): string {
    const produit = this.TbStockproduits.find((p) => p.produit_id === id);
    return produit ? produit.nom : '';
  }

  getVenteName(id: number): string {
    const vente = this.ventes.find((v) => v.vente_id === id);
    return vente ? this.globalService.formatDate(vente.date_vente) : '';
  }

  getUserName(id: number): string {
    const user = this.tbUsers.find((u) => u.utilisateur_id === id);
    return user ? user.nom_utilisateur : '';
  }

  getClientsName(id: number): string {
    const client = this.tbClients.find((c) => c.client_id === id);
    return client ? client.nom : '';
  }

  private fetchImage(
    id: number,
    type: 'produit' | 'user',
    target: { [key: number]: any }
  ) {
    if (target[id]) return; // Already fetched

    if (type === 'produit') {
      const produit: GetProduit = { produit_id: id };
      this.produitService.getImageByProduit(produit).subscribe({
        next: (data) => {
          if (data.message) {
            target[id] = data.message;
          }
        },
        error: (err) => {
          console.error(`Erreur chargement image produit (ID: ${id})`, err);
        },
      });
    }

    if (type === 'user') {
      const user: GetUser = { utilisateur_id: id };
      this.userService.getImageByUser(user).subscribe({
        next: (data) => {
          if (data.message) {
            target[id] = data.message;
          }
        },
        error: (err) => {
          console.error(`Erreur chargement image utilisateur (ID: ${id})`, err);
        },
      });
    }
  }

  loadUsers(): void {
    const user: GetUser = { utilisateur_id: 0 };
    this.userService.getListUser(user).subscribe((data: any) => {
      this.tbUsers = data.message;
      console.log(this.tbUsers);

      this.tbUsers.forEach((user) =>
        this.fetchImage(user.utilisateur_id, 'user', this.imageUsers)
      );
    });
  }

  getDernieresVentes() {
    this.dernieresVentes = [...this.ventes]
      .sort(
        (a, b) =>
          new Date(b.date_vente).getTime() - new Date(a.date_vente).getTime()
      )
      .slice(0, 10);
  }

  loadVentes() {
    const vente: GetVente = { vente_id: 0 };
    this.venteService.getList(vente).subscribe((data: any) => {
      const ventes = data.message || [];
      const userVentesMap = new Map<number, number>();
      ventes.forEach((v: any) => {
        const uid = v.utilisateur_id;
        if (uid !== undefined) {
          userVentesMap.set(uid, (userVentesMap.get(uid) || 0) + 1);
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

  afficherGraphiqueBeneficesParJour(tbFilterArticleVentes: ArticlesDeVentes[]) {

    if (!Array.isArray(tbFilterArticleVentes)) {
      console.error('tbBenefices is not an array:',tbFilterArticleVentes);
      return;
    }

    const currentYear = new Date().getFullYear();
    const beneficesParDate = new Map<string, number>();

    tbFilterArticleVentes.forEach((article) => {
      const d = new Date(article.date_article_vendu);
      if (d.getFullYear() === currentYear) {
        const dateKey = d.toISOString().split('T')[0];
        const benefice = Number(article.benefice || '0');
        beneficesParDate.set(
          dateKey,
          (beneficesParDate.get(dateKey) || 0) + benefice
        );
      }
    });

    const sortedEntries = Array.from(beneficesParDate.entries()).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );

    const dates = sortedEntries.map(([date]) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    });

    const data = sortedEntries.map(([_, benef]) => parseFloat(benef.toFixed(2)));

    // Déterminer le max en arrondissant au multiple supérieur de 5000
    const maxValue = Math.max(...data);
    const yAxisMax = Math.ceil(maxValue / 5000) * 5000;

    const chart = new ApexCharts(
      document.querySelector('#benefices-par-jour-chart'),
      {
        chart: {
          height: 380,
          width: '100%',
          type: 'bar',
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '50%',
            endingShape: 'rounded',
          },
        },
        series: [{ name: 'Bénéfice quotidien', data }],
        xaxis: {
          categories: dates,
          labels: {
            rotate: -45,
            style: { fontSize: '10px', colors: '#A0ACBB' },
          },
          title: { text: 'Date de vente' },
        },
        yaxis: {
          min: 0,
          max: yAxisMax,
          tickAmount: yAxisMax / 5000,
          labels: {
            formatter: (val: number) => `${(val / 1000).toFixed(0)}K `,
            style: { color: '#A0ACBB' },
          },
        },
        tooltip: {
          y: {
            formatter: (val: number) =>
              `${val.toLocaleString('fr-FR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })} FCFA`,
          },
        },
        grid: { yaxis: { lines: { show: false } } },
        colors: ['#00bfa6'],
        dataLabels: { enabled: false },
      }
    );

    chart.render();
  }

  afficherGraphique(ventes: Vente[]) {

    console.log(ventes);
    
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const yearSuffix = currentYear.toString().slice(2);

    const montantsAnneeCourante = Array(12).fill(0);
    const montantsAnneePrecedente = Array(12).fill(0);

    ventes.forEach((v) => {
      const d = new Date(v.date_vente);
      const mois = d.getMonth();
      const annee = d.getFullYear();
      const montant = Number(v.montant_total);

      if (annee === currentYear) {
        montantsAnneeCourante[mois] += montant;
      } else if (annee === previousYear) {
        montantsAnneePrecedente[mois] += montant;
      }
    });

    const chart = new ApexCharts(
      document.querySelector('#payment-records-chart2'),
      {
        chart: {
          height: 380,
          width: '100%',
          type: 'bar',
          stacked: false,
          toolbar: { show: false },
        },
        stroke: {
          width: [1],
          curve: 'smooth',
        },
        plotOptions: {
          bar: {
            endingShape: 'rounded',
            columnWidth: '35%',
            dataLabels: { position: 'top' },
          },
        },
        colors: ['#3454d1', '#FFA500'], // Bleu et orange
        series: [
          {
            name: `Ventes ${currentYear}`,
            data: montantsAnneeCourante.map((m) => parseFloat(m.toFixed(2))),
          },
          {
            name: `Ventes ${previousYear}`,
            data: montantsAnneePrecedente.map((m) => parseFloat(m.toFixed(2))),
          },
        ],
        xaxis: {
          categories: this.moisNoms.map((m) => `${m}/${yearSuffix}`),
          labels: { style: { fontSize: '10px', colors: '#A0ACBB' } },
        },
        yaxis: {
          min: 0,
          tickAmount: 5, // Crée des intervalles de 20K si le max ≈ 100K
          labels: {
            formatter: (val: number) => `${(val / 1000).toFixed(0)}K`,
            style: { color: '#A0ACBB' },
          },
        },
        tooltip: {
          y: {
            formatter: (val: number) =>
              `${val.toLocaleString('fr-FR')} FCFA`,
          },
        },
        grid: {
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: false } },
        },
        dataLabels: { enabled: false },
        legend: {
          show: true,
          position: 'top',
          labels: { colors: '#A0ACBB' },
        },
      }
    );

    chart.render();
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  getStartOfThisWeek(): Date {
    const now = new Date();
    const day = now.getDay(); // 0 (dimanche) à 6 (samedi)
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Lundi = début de semaine
    const start = new Date(now.getFullYear(), now.getMonth(), diff);
    start.setHours(0, 0, 0, 0); // Met à minuit
    return start;
  }

  getEndOfThisWeek(): Date {
    const start = this.getStartOfThisWeek();
    return new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + 6,
      23,
      59,
      59
    );
  }

  getStartOfLastWeek(): Date {
    const d = this.getStartOfThisWeek();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7);
  }

  getEndOfLastWeek(): Date {
    const d = this.getStartOfThisWeek();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, 23, 59, 59);
  }

  isSameYear(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear();
  }
}
