import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LOG } from '@zxing/library/esm/core/datamatrix/encoder/constants';
import { firstValueFrom } from 'rxjs';
import {
  ArticlesDeVentes,
  GetArticleDeVente,
} from 'src/app/Models/articlesDeVente.model';
import { Categorie, GetCategorie } from 'src/app/Models/categorie.model';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { Depense, GetDepense } from 'src/app/Models/depenses.model';
import {
  GetPointsDeVentes,
  PointsDeVentes,
} from 'src/app/Models/pointsDeVentes.model';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { GetVente, Vente } from 'src/app/Models/vente.model';
import { ArticlesDeVenteService } from 'src/app/Services/articles-de-vente.service';
import { ClientsService } from 'src/app/Services/clients.service';
import { DepensesService } from 'src/app/Services/depenses.service';
import { GlobalService } from 'src/app/Services/global.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { ProduitService } from 'src/app/Services/produit.service';
import { UsersService } from 'src/app/Services/users.service';
import { VenteService } from 'src/app/Services/vente.service';

// Définition de l'interface CategoryRentability avec une signature d'index
interface CategoryRentability {
  categorieId: number;
  chiffreAffaires: number;
  beneficeNet: number;
  tauxRentabilite: number;
}

// La signature d'index permet d'utiliser un `number` comme clé
interface CategoryRentabilityMap {
  [key: number]: CategoryRentability;
}

interface ProduitRentabilite {
  produit: string;
  chiffreAffaires: number;
  beneficeNet: number;
  tauxRentabilite: number;
}


@Component({
  selector: 'app-rentabilite',
  templateUrl:'./rentabilite.component.html',
  styleUrls: ['./rentabilite.component.scss'],
})
export class RentabiliteComponent {
  dataSourceVente!: any;
  displayedColumns = [
    'date_vente',
    'montant_total',
    'point_de_vente_id',
    'total_benefice_vente',
  ];

  
  ventesOriginales: any[] = [];
  produits: Produit[] = [];
  TbArtcile: ArticlesDeVentes[] = [];
  depensesOriginales: Depense[] = [];
  depensesFiltrees: Depense[] = [];
  topArticles: any[] = [];
 topCategories: any[] = [];
  dateDebut: any;
  dateFin: any;
  comparateur: any;
  imageproduitArticle: { [key: number]: string } = {};
  isloadingpage!: boolean;
  chiffreAffaires: number = 0;
  cpvTotal: number = 0;
  margeBrute: number = 0;
  pourcentageMargeBrute: number = 0;

  chartInstanceMargeBrute: any = null;
  chartInstanceMargeNette: any = null;
  chartInstanceChiffresAffaires: any = null;
  TauxRentabilite: any = null;
  TotalDepenseschartInstanceChiffresAffaires: any = null;
  filteredTbArtcile: any;
  ratioVentesDepenses!: number;
  beneficeNet!: number;
  margeNette!: number;
  BenefficeNetChart: any = null;
  BenefficeNetChartCA: any = null;

  ventesFiltrees: Vente[] = [];
  TbCategorieProduit: Categorie[] = []
  BilledAreaChart: any;
  topProduits!: any[];
  TauxRentabiliteChart: any;

  
  constructor(
    private venteService: VenteService,
    private articleventeService: ArticlesDeVenteService,
    public globalService: GlobalService,
    private produitService: ProduitService,
    private depenseService: DepensesService,
  ) {}

  @ViewChild('chart', { static: true }) chartElement: ElementRef | undefined;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListVente();
    this.getListeArticleDeVentes();
    this.getDepenses();
    this.getListProduit();
    this.getCombinationByProduit();
    this.getCategorieProduit()
  }

  getListProduit() {
    const produit: GetProduit = { produit_id: 0 };
    this.produitService.getList(produit).subscribe((data) => {
      this.produits = data.message;
      console.log(this.produits);
         this.calculerTopProduits();
    });
  }

  getCategorieProduit(){
    this.produitService.getListCategorieProduit().subscribe(res =>{
     console.log(res.message);
     this.TbCategorieProduit = res.message
    })
  }

  getProduitName(produit_id: number): string {
    const produit = this.produits.find((p) => p.produit_id === produit_id);
    return produit ? produit.nom : '';
  }

   getCategorieName(categorie_id: number): string {
    const categorie = this.TbCategorieProduit.find((p) => p.categorie_id === categorie_id);
    return categorie ? categorie.nom : '';
  }

  getCombinationByProduit() {
    this.produitService.getCombinaisonById(76).subscribe((res) => {
      console.log(res);
    });
  }

  getImageByproduiIDByArticle(IDproduit: number) {
    const produit: GetProduit = { produit_id: IDproduit };
    this.produitService.getImageByProduit(produit).subscribe((data) => {
      console.log(data);
      if (data.message) {
        this.imageproduitArticle[IDproduit] = `${data.message}`;
        console.log(this.imageproduitArticle);
      } else {
        console.log(`Aucune image trouvée pour le produit ID: ${IDproduit}`);
      }
    });
  }

  getListVente() {
    const vente: GetVente = { vente_id: 0 };
    this.venteService.getList(vente).subscribe(
      (data) => {
        this.ventesOriginales = data.message;
        console.log(this.ventesOriginales);
        if (this.ventesOriginales) {
          this.comparateur = 'cette_semaine';
          this.applyFilters();
        }
      },
      (error) => {
        console.error('Erreur dans la récupération des données:', error);
        this.isloadingpage = false;
      }
    );
  }

  getListeArticleDeVentes() {
    const article: GetArticleDeVente = {
      article_de_vente_id: 0,
    };

    this.articleventeService.getList(article).subscribe((res) => {
      this.TbArtcile = res.message;
      console.log(this.TbArtcile);
      this.comparateur = 'cette_semaine';
      this.applyFilteredTbArtcile();
    });
  }

  getDepenses() {
    const depense: GetDepense = { id_depense: 0 };
    this.depenseService.getListDepenses(depense).subscribe((data) => {
      console.log(data.message);
      this.depensesOriginales = data.message;
      if (this.depensesOriginales) {
        this.comparateur = 'cette_semaine';
        this.applyDepenseFilters();
      }
    });
  }

  onFilterChange() {
    this.applyDepenseFilters();
    this.applyFilters();
    this.applyFilteredTbArtcile();
  }

  applyFilters() {
    let filtered = [...this.ventesOriginales];
    console.log(filtered);

    // Appliquer les filtres sur les ventes
    if (this.dateDebut) {
      this.comparateur = '';
      filtered = filtered.filter(
        (v) => new Date(v.date_vente) >= new Date(this.dateDebut)
      );
    }

    if (this.dateFin) {
      this.comparateur = '';
      filtered = filtered.filter(
        (v) => new Date(v.date_vente) <= new Date(this.dateFin)
      );
    }

    const now = new Date();
    switch (this.comparateur) {
      case 'aujourdhui':
        filtered = filtered.filter((v) =>
          this.isSameDate(new Date(v.date_vente), now)
        );
        break;

      case 'semaine_derniere': {
        const start = this.getStartOfLastWeek();
        const end = this.getEndOfLastWeek();
        filtered = filtered.filter(
          (v) =>
            new Date(v.date_vente) >= start && new Date(v.date_vente) <= end
        );
        break;
      }

      case 'cette_semaine': {
        const start = this.getStartOfThisWeek();
        const end = this.getEndOfThisWeek();
        filtered = filtered.filter(
          (v) =>
            new Date(v.date_vente) >= start && new Date(v.date_vente) <= end
        );
        break;
      }

      case 'mois': {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        filtered = filtered.filter((v) => {
          const date = new Date(v.date_vente);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        });
        break;
      }
    }

    // Mettre à jour les ventes filtrées
    this.ventesFiltrees = filtered;
    console.log(this.ventesFiltrees);

    // Calculer le chiffre d'affaires
    this.chiffreAffaires = filtered.reduce(
      (acc, vente) => acc + parseFloat(vente.montant_total || '0'),
      0
    );
    this.dataSourceVente = new MatTableDataSource(filtered);
    this.dataSourceVente.sort = this.sort;
    this.dataSourceVente.paginator = this.paginator;
    this.calculerRentabiliteSimple();
    this.calculerBeneficesNets(filtered, this.depensesFiltrees);
    this.compTotalDVsCA(this.ventesFiltrees,this.depensesFiltrees);
  }

  applyFilteredTbArtcile() {
    if (!this.TbArtcile) return;

    let filtered = [...this.TbArtcile];
    console.log(filtered);
    const now = new Date();

    // Filtrer par date de début
    if (this.dateDebut) {
      filtered = filtered.filter(
        (article) =>
          new Date(article.date_article_vendu) >= new Date(this.dateDebut)
      );
    }

    // Filtrer par date de fin
    if (this.dateFin) {
      filtered = filtered.filter(
        (article) =>
          new Date(article.date_article_vendu) <= new Date(this.dateFin)
      );
    }

    // Appliquer comparateur
    switch (this.comparateur) {
      case 'aujourdhui':
        filtered = filtered.filter((article) =>
          this.isSameDate(new Date(article.date_article_vendu), now)
        );
        break;

      case 'semaine_derniere': {
        const start = this.getStartOfLastWeek();
        const end = this.getEndOfLastWeek();
        filtered = filtered.filter(
          (article) =>
            new Date(article.date_article_vendu) >= start &&
            new Date(article.date_article_vendu) <= end
        );
        break;
      }

      case 'cette_semaine': {
        const start = this.getStartOfThisWeek();
        const end = this.getEndOfThisWeek();
        filtered = filtered.filter(
          (article) =>
            new Date(article.date_article_vendu) >= start &&
            new Date(article.date_article_vendu) <= end
        );
        break;
      }

      case 'mois': {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        filtered = filtered.filter((article) => {
          const d = new Date(article.date_article_vendu);
          return (
            d.getMonth() === currentMonth && d.getFullYear() === currentYear
          );
        });
        break;
      }
    }

    console.log(filtered);
    this.filteredTbArtcile = filtered;
    console.log(this.filteredTbArtcile);
    this.calculerTopProduits()
    this.calculerTopCategories()
    this.calculerCPVTotalDepuisFiltres();
  }

  applyDepenseFilters() {
    let filtered = [...this.depensesOriginales];
    console.log(filtered);

    // Appliquer les filtres
    if (this.dateDebut) {
      this.comparateur = '';
      filtered = filtered.filter(
        (d) => new Date(d.date_heure) >= new Date(this.dateDebut)
      );
    }

    if (this.dateFin) {
      this.comparateur = '';
      filtered = filtered.filter(
        (d) => new Date(d.date_heure) <= new Date(this.dateFin)
      );
    }

    const now = new Date();
    switch (this.comparateur) {
      case 'aujourdhui':
        filtered = filtered.filter((d) =>
          this.isSameDate(new Date(d.date_heure), now)
        );
        break;

      case 'semaine_derniere': {
        const start = this.getStartOfLastWeek();
        const end = this.getEndOfLastWeek();
        filtered = filtered.filter(
          (d) =>
            new Date(d.date_heure) >= start && new Date(d.date_heure) <= end
        );
        break;
      }

      case 'cette_semaine': {
        const start = this.getStartOfThisWeek();
        const end = this.getEndOfThisWeek();
        filtered = filtered.filter(
          (d) =>
            new Date(d.date_heure) >= start && new Date(d.date_heure) <= end
        );
        break;
      }

      case 'mois': {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        filtered = filtered.filter((d) => {
          const date = new Date(d.date_heure);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        });
        break;
      }
    }    
    this.depensesFiltrees = filtered;
    console.log(this.depensesFiltrees);
    this.calculerRentabiliteSimple();
    this.calculerBeneficesNets(this.ventesFiltrees, this.depensesFiltrees);
    this.compTotalDVsCA(this.ventesFiltrees,this.depensesFiltrees)
  }

  calculerRentabiliteSimple() {
    const ventesFiltrees = this.dataSourceVente?.data || [];
    const depensesFiltrees = this.depensesFiltrees || [];

    if (ventesFiltrees && depensesFiltrees) {
      // Total CA
      const chiffreAffaires = ventesFiltrees.reduce(
        (acc: number, vente: { montant_total: any }) =>
          acc + parseFloat(vente.montant_total || '0'),
        0
      );

      // Total Dépenses
      const totalDepenses = depensesFiltrees.reduce(
        (acc, depense) => acc + Number(depense.montant || '0'),
        0
      );

      // Calculs
      const beneficeNet = chiffreAffaires - totalDepenses;
      const margeNette =
        chiffreAffaires > 0 ? (beneficeNet / chiffreAffaires) * 100 : 0;
      const ratioVentesDepenses =
        totalDepenses > 0 ? chiffreAffaires / totalDepenses : 0;

      // Stocker pour affichage si nécessaire
      this.margeNette = margeNette;
      this.beneficeNet = beneficeNet;
      this.ratioVentesDepenses = ratioVentesDepenses;
    } else {
      console.log('#######');
    }
  }

  async calculerCPVTotalDepuisFiltres() {
    console.log(this.filteredTbArtcile);

    if (!this.filteredTbArtcile) return;

    const produitRequest = { produit_id: 0 };

    let produits: any[] = [];

    try {
      const data: any = await firstValueFrom(
        this.produitService.getList(produitRequest)
      );
      produits = data.message;
      console.log('Produits récupérés :', produits);
    } catch (error) {
      console.error('Erreur lors du chargement des produits', error);
      return;
    }

    let total = 0;

    const promises = this.filteredTbArtcile.map(
      async (article: { id: number; produit_id: any; quantite: number }) => {
        let prixRevient = 0;

        // Produit variable
        if (article.id && article.id !== 0) {
          try {
            const res: any = await firstValueFrom(
              this.produitService.getCombinaisonById(article.id)
            );
            prixRevient = Number(res.message?.prix_de_revient || '0');
            console.log(prixRevient);
          } catch (err) {
            console.error(err);
          }
        }
        // Produit simple
        else {
          const produit = produits.find(
            (p) => p.produit_id === article.produit_id
          );
          if (produit) {
            prixRevient = Number(produit.prix_de_revient || '0');
          }
        }

        const quantite = article.quantite || 0;
        total += prixRevient * quantite;
      }
    );

    await Promise.all(promises);

    this.cpvTotal = total;

    this.margeBrute = this.chiffreAffaires - this.cpvTotal;
    this.pourcentageMargeBrute =
      this.chiffreAffaires > 0
        ? (this.margeBrute / this.chiffreAffaires) * 100
        : 0;

    console.log(this.margeBrute);
  }

  calculerBeneficesNets(filteredVentes: any, filteredDepenses: any) {
    const ventesTotales = filteredVentes.reduce((total: number, vente: any) => {
      return total + parseFloat(vente.montant_total || '0');
    }, 0);

    const depensesTotales = filteredDepenses.reduce(
      (total: number, depense: any) => {
        return total + parseFloat(depense.montant || '0');
      },
      0
    );

    const beneficesNets = ventesTotales - depensesTotales;
    this.beneficeNet = beneficesNets;

    console.log(filteredVentes);
    

    // Appel de la méthode pour afficher le graphique
    this.renderBenefficeNet(
      filteredVentes,
      filteredDepenses,
      ventesTotales,
      depensesTotales,
      beneficesNets
    );

    this.renderChiffreAffairesEtBeneficeNet(filteredVentes, filteredDepenses);
  }

  renderChiffreAffairesEtBeneficeNet(
    filteredVentes: any,
    filteredDepenses: any
  ): void {
    const now = new Date();
    const currentYear = now.getFullYear();

    const datesVentes = filteredVentes.map((v: any) => new Date(v.date_vente));
    const datesDepenses = filteredDepenses.map((d: any) => new Date(d.date_heure));

    const allDates = [...datesVentes, ...datesDepenses];
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));

    const formatter = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const periodeText = `Période du ${formatter.format(minDate)} au ${formatter.format(maxDate)}`;
    const periodeElement = document.getElementById('periode-affichage');
    if (periodeElement) {
      periodeElement.textContent = periodeText;
    }

    const groupedVentes: { [key: string]: number } = {};
    const groupedDepenses: { [key: string]: number } = {};

    filteredVentes.forEach((vente: any) => {
      const date = new Date(vente.date_vente);
      const dayMonth = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      if (!groupedVentes[dayMonth]) {
        groupedVentes[dayMonth] = 0;
      }

      groupedVentes[dayMonth] += parseFloat(vente.montant_total || '0');
    });

    filteredDepenses.forEach((depense: any) => {
      const date = new Date(depense.date_heure);
      const dayMonth = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      if (!groupedDepenses[dayMonth]) {
        groupedDepenses[dayMonth] = 0;
      }

      groupedDepenses[dayMonth] += parseFloat(depense.montant || '0');
    });

    const categories = Object.keys(groupedVentes).sort((a, b) => {
      const [dayA, monthA] = a.split('/');
      const [dayB, monthB] = b.split('/');
      return (
        new Date(`${currentYear}-${monthA}-${dayA}`).getTime() -
        new Date(`${currentYear}-${monthB}-${dayB}`).getTime()
      );
    });

    // Calcul des bénéfices nets pour chaque date
    const beneficesData = categories.map((date) => {
      const vente = groupedVentes[date] || 0;
      const depense = groupedDepenses[date] || 0;
      return (vente - depense) / 1000; // Bénéfice net en 'K'
    });

    // Calcul du chiffre d'affaires pour chaque date
    const caData = categories.map((date) => (groupedVentes[date] || 0) / 1000); // Chiffre d'affaires en 'K'

    const options = {
      chart: {
        height: 350,
        width: '100%',
        type: 'line',
        toolbar: { show: false },
      },
      series: [
        {
          name: 'Chiffre d\'affaires',
          data: caData, // Chiffre d'affaires en 'K'
          color: '#00E396', // Couleur pour le CA
        },
        {
          name: 'Bénéfices Nets',
          data: beneficesData, // Bénéfice net en 'K'
          color: '#FF4560', // Couleur pour les bénéfices nets
        },
      ],
      dataLabels: { enabled: false },
      xaxis: {
        categories: categories,
        labels: {
          style: { fontSize: '10px', colors: '#64748b' },
        },
      },
      yaxis: {
        title: {
          text: 'Montants (en K)',
          style: { color: '#64748b' },
        },
        labels: {
          formatter: (val: number) => `${val}K`, // Formatage pour les montants en 'K'
          style: { color: '#64748b' },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}K`, // Formatage du tooltip pour les montants en 'K'
        },
      },
      legend: {
        show: true,
        position: 'top',
        labels: { colors: '#64748b', fontSize: '12px' },
      },
    };

    const chartContainer = document.querySelector('#beneffice-net-chiffre');
    if (this.BenefficeNetChartCA) {
      this.BenefficeNetChartCA.destroy();
    }

    this.BenefficeNetChartCA = new ApexCharts(chartContainer, options);
    this.BenefficeNetChartCA.render();
  }

renderBenefficeNet(
  filteredVentes: any,
  filteredDepenses: any,
  ventesTotales: number,
  depensesTotales: number,
  beneficesNets: number
): void {
  const now = new Date();
  const currentYear = now.getFullYear();

  const datesVentes = filteredVentes.map((v: any) => new Date(v.date_vente));
  const datesDepenses = filteredDepenses.map(
    (d: any) => new Date(d.date_heure)
  );

  const allDates = [...datesVentes, ...datesDepenses];
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));

  const formatter = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const periodeText = `Période du ${formatter.format(
    minDate
  )} au ${formatter.format(maxDate)}`;
  const periodeElement = document.getElementById('periode-affichage');
  if (periodeElement) {
    periodeElement.textContent = periodeText;
  }

  const groupedVentes: { [key: string]: number } = {};
  const groupedDepenses: { [key: string]: number } = {};

  filteredVentes.forEach((vente: any) => {
    const date = new Date(vente.date_vente);
    const dayMonth = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (!groupedVentes[dayMonth]) {
      groupedVentes[dayMonth] = 0;
    }

    groupedVentes[dayMonth] += parseFloat(vente.montant_total || '0');
  });

  filteredDepenses.forEach((depense: any) => {
    const date = new Date(depense.date_heure);
    const dayMonth = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (!groupedDepenses[dayMonth]) {
      groupedDepenses[dayMonth] = 0;
    }

    groupedDepenses[dayMonth] += parseFloat(depense.montant || '0');
  });

  const categories = Object.keys(groupedVentes).sort((a, b) => {
    const [dayA, monthA] = a.split('/');
    const [dayB, monthB] = b.split('/');
    return (
      new Date(`${currentYear}-${monthA}-${dayA}`).getTime() -
      new Date(`${currentYear}-${monthB}-${dayB}`).getTime()
    );
  });

  // Calcul des bénéfices nets pour chaque date et conversion en milliers
  const beneficesData = categories.map((date, index) => {
    const vente = groupedVentes[date] || 0;
    const depense = groupedDepenses[date] || 0;
    return (vente - depense) / 1000; // Convertir le bénéfice net en milliers (K)
  });

  const options = {
    chart: {
      height: 350,
      width: '100%',
      type: 'line',
      toolbar: { show: false },
    },
    series: [
      {
        name: 'Bénéfices Nets',
        data: beneficesData, // Seulement les bénéfices nets
      },
    ],
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories,
      labels: {
        style: { fontSize: '10px', colors: '#64748b' },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val.toFixed(2)}K`, // Afficher en milliers avec 2 décimales
        style: { color: '#64748b' },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(2)}K`, // Afficher en milliers avec 2 décimales
      },
    },
    legend: {
      show: true,
      position: 'top',
      labels: { colors: '#64748b', fontSize: '12px' },
    },
  };

  const chartContainer = document.querySelector('#beneffice-net');
  if (this.BenefficeNetChart) {
    this.BenefficeNetChart.destroy();
  }

  this.BenefficeNetChart = new ApexCharts(chartContainer, options);
  this.BenefficeNetChart.render();
}


  compTotalDVsCA(filteredVentes: any, filteredDepenses: any): void {
    console.log(filteredVentes);
    console.log(filteredDepenses);

    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;

    // 👉 Période d'affichage basée sur les ventes
    if (filteredVentes.length > 0) {
      const dates = filteredVentes.map((v: any) => new Date(v.date_vente));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));

      const formatter = new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const periodeText = `Période du ${formatter.format(minDate)} au ${formatter.format(maxDate)}`;

      const periodeElement = document.getElementById('periode-affichage');
      if (periodeElement) {
        periodeElement.textContent = periodeText;
      }
    }

    const groupedVentes: { [key: string]: { current: number; previous: number } } = {};
    const groupedDepenses: { [key: string]: { current: number; previous: number } } = {};

    // ➤ Groupement des ventes actuelles
    filteredVentes.forEach((vente: any) => {
      const date = new Date(vente.date_vente);
      const dayMonthYear = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      if (!groupedVentes[dayMonthYear]) {
        groupedVentes[dayMonthYear] = { current: 0, previous: 0 };
      }

      if (date.getFullYear() === currentYear) {
        groupedVentes[dayMonthYear].current += Number(vente.montant_total);
      }
    });

    // ➤ Groupement des dépenses actuelles
    filteredDepenses.forEach((depense: any) => {
      const date = new Date(depense.date_heure);
      const dayMonthYear = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      if (!groupedDepenses[dayMonthYear]) {
        groupedDepenses[dayMonthYear] = { current: 0, previous: 0 };
      }

      if (date.getFullYear() === currentYear) {
        groupedDepenses[dayMonthYear].current += Number(depense.montant);
      }
    });

    // ➤ Récupération des ventes et dépenses de l’année précédente
    const allDatesSet = new Set([
      ...Object.keys(groupedVentes),
      ...Object.keys(groupedDepenses),
    ]);

    allDatesSet.forEach((dayMonthYear) => {
      const [day, month, year] = dayMonthYear.split('/');
      const previousDate = new Date(`${previousYear}-${month}-${day}`);

      const ventesPrecedentes = this.ventesOriginales.filter((vente: any) => {
        const venteDate = new Date(vente.date_vente);
        return (
          venteDate.getFullYear() === previousYear &&
          venteDate.getDate() === previousDate.getDate() &&
          venteDate.getMonth() === previousDate.getMonth()
        );
      });

      const depensesPrecedentes = this.depensesOriginales.filter((depense: any) => {
        const depenseDate = new Date(depense.date_heure);
        return (
          depenseDate.getFullYear() === previousYear &&
          depenseDate.getDate() === previousDate.getDate() &&
          depenseDate.getMonth() === previousDate.getMonth()
        );
      });

      if (!groupedVentes[dayMonthYear]) {
        groupedVentes[dayMonthYear] = { current: 0, previous: 0 };
      }
      if (!groupedDepenses[dayMonthYear]) {
        groupedDepenses[dayMonthYear] = { current: 0, previous: 0 };
      }

      ventesPrecedentes.forEach((vente: any) => {
        groupedVentes[dayMonthYear].previous += Number(vente.montant_total);
      });

      depensesPrecedentes.forEach((depense: any) => {
        groupedDepenses[dayMonthYear].previous += Number(depense.montant);
      });
    });

    const categories = Array.from(allDatesSet).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/');
      const [dayB, monthB, yearB] = b.split('/');
      return (
        new Date(`${yearA}-${monthA}-${dayA}`).getTime() -
        new Date(`${yearB}-${monthB}-${dayB}`).getTime()
      );
    });

    const currentVentesData = categories.map((date) => groupedVentes[date]?.current ?? 0);
    const previousVentesData = categories.map((date) => groupedVentes[date]?.previous ?? 0);
    const currentDepensesData = categories.map((date) => groupedDepenses[date]?.current ?? 0);
    const previousDepensesData = categories.map((date) => groupedDepenses[date]?.previous ?? 0);

    const options = {
      chart: {
        height: 262,
        type: 'area',
        stacked: false,
        toolbar: { show: false },
      },
      xaxis: {
        categories: categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { fontSize: '10px', colors: '#64748b' },
        },
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            if (val >= 1000) {
              return (val / 1000).toFixed(1) + ' kF';
            }
            return val + ' F';
          },
          offsetX: -22,
          offsetY: 0,
          style: { fontSize: '10px', color: '#64748b' },
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2.5, // ➤ Épaisseur augmentée
        dashArray: [0, 4, 0, 4], // ➤ Optionnel : style tireté/plein
        lineCap: 'round',
      },
      grid: {
        padding: { left: 0, right: 0 },
        strokeDashArray: 3,
        borderColor: '#ebebf3',
        row: { colors: ['#ebebf3', 'transparent'], opacity: 0.02 },
      },
      legend: { show: true },
      colors: ['#3454d1', '#25b865', '#ff6347', '#f7c72d'],
      dataLabels: { enabled: false },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      series: [
        {
          name: `Ventes ${currentYear}`,
          data: currentVentesData,
          type: 'area',
        },
        {
          name: `Ventes ${previousYear}`,
          data: previousVentesData,
          type: 'area',
        },
        {
          name: `Dépenses ${currentYear}`,
          data: currentDepensesData,
          type: 'area',
        },
        {
          name: `Dépenses ${previousYear}`,
          data: previousDepensesData,
          type: 'area',
        },
      ],
      tooltip: {
        y: {
          formatter: function (val: number) {
            if (val >= 1000) {
              return (val / 1000).toFixed(1) + ' kF';
            }
            return val + ' F';
          },
        },
        style: { fontSize: '12px', fontFamily: 'Inter' },
      },
    };

    const chartContainer = document.querySelector('#total-depense-chiffres-affaire');
    if (!chartContainer) {
      console.warn('Conteneur du graphique introuvable');
      return;
    }

    if (this.TotalDepenseschartInstanceChiffresAffaires) {
      this.TotalDepenseschartInstanceChiffresAffaires.destroy();
      this.TotalDepenseschartInstanceChiffresAffaires = null;
    }

    this.TotalDepenseschartInstanceChiffresAffaires = new ApexCharts(chartContainer, options);
    this.TotalDepenseschartInstanceChiffresAffaires.render();
  }


async calculerTopProduits() {
  // Récupérer les informations des produits avec rentabilité
  const produitsAvecRentabilite = await Promise.all(this.filteredTbArtcile.map(async (article: { produit_id: number; id: number; }) => {
    // Recherche du produit à partir de l'id
    const produit = this.produits.find((p) => p.produit_id === article.produit_id);
    if (!produit) return null; // Si le produit n'existe pas, ignorer cet article
    
    // Récupérer le nom du produit à partir de l'objet produit
    const produitNom = produit.nom;

    let coutAchatProduit, coutRevientProduit;

    // Vérifier si c'est un produit variable (article.id !== 0)
    if (article.id !== 0 && article.id !== null ) {
      // Récupérer la combinaison de produit variable
      const combinaison = await this.produitService.getCombinaisonById(article.id).toPromise();
      coutAchatProduit = parseFloat(combinaison.message.prix_achat || '0');
      coutRevientProduit = parseFloat(combinaison.message.cout_de_revient || '0');
    } else {
      // Produit simple (article.id === 0)
      coutAchatProduit = Number(produit.prix_achat || '0');
      coutRevientProduit = Number(produit.cout_de_revient || '0');
    }

    // Calcul du chiffre d'affaires total pour chaque produit (prix unitaire * quantité vendue)
    const totalVenteProduit = this.filteredTbArtcile
      .filter((articleFiltré: { produit_id: number; }) => articleFiltré.produit_id === article.produit_id)
      .reduce((total: number, articleFiltré: { prix_unitaire: string; quantite: number; }) => 
        total + (parseFloat(articleFiltré.prix_unitaire) * articleFiltré.quantite), 0);

    // Quantité totale vendue pour chaque produit
    const quantiteVendue = this.filteredTbArtcile
      .filter((articleFiltré: { produit_id: number; }) => articleFiltré.produit_id === article.produit_id)
      .reduce((total: number, articleFiltré: { quantite: number; }) => total + articleFiltré.quantite, 0);

    // Calcul du coût des produits vendus (CPV)
    const cpvProduit = coutRevientProduit * quantiteVendue;

    // Calcul du bénéfice net produit
    const beneficeNetProduit = totalVenteProduit - cpvProduit;

    // Calcul du taux de rentabilité, avec vérification que le CPV n'est pas égal à 0
    let tauxRentabiliteProduit;
    if (cpvProduit !== 0) {
      tauxRentabiliteProduit = ((beneficeNetProduit / cpvProduit) * 100).toFixed(2); // Formater avec 2 décimales
    }

    return {
      produit: produitNom, // Utiliser le nom récupéré à partir de l'objet produit
      chiffreAffaires: totalVenteProduit,
      beneficeNet: beneficeNetProduit,
      tauxRentabilite: Number(tauxRentabiliteProduit), // Retourner sous forme de nombre
    } as ProduitRentabilite;
  }));

  // Filtrer les résultats nuls et trier par rentabilité
  const produitsAvecRentabiliteFiltrés = produitsAvecRentabilite.filter((produit): produit is ProduitRentabilite => produit !== null);

  // Regrouper les produits par nom pour éliminer les doublons
  const produitsRegroupés = produitsAvecRentabiliteFiltrés.reduce((acc, produit) => {
    if (!acc[produit.produit]) {
      acc[produit.produit] = produit;
    } else {
      // Si le produit existe déjà, on additionne les chiffres d'affaires, bénéfice net et taux de rentabilité
      acc[produit.produit].chiffreAffaires += produit.chiffreAffaires;
      acc[produit.produit].beneficeNet += produit.beneficeNet;
      // On garde la rentabilité du produit avec le plus haut chiffre d'affaires
      if (produit.chiffreAffaires > acc[produit.produit].chiffreAffaires) {
        acc[produit.produit].tauxRentabilite = produit.tauxRentabilite;
      }
    }
    return acc;
  }, {} as Record<string, ProduitRentabilite>); // Utilisation d'un objet avec une clé de type string

  // Convertir l'objet en tableau et trier par rentabilité
  this.topProduits = Object.values(produitsRegroupés)
    .sort((a, b) => b.tauxRentabilite - a.tauxRentabilite) // Trier en fonction du taux de rentabilité
    .slice(0, 5); // Prendre les 5 premières catégories

  // Extraire les noms des produits et leurs taux de rentabilité
  const produitsNom = this.topProduits.map((produit) => produit.produit);
  const tauxRentabilite = this.topProduits.map((produit) => produit.tauxRentabilite);

  // Appeler la fonction pour afficher le graphique
  this.renderGraphTauxRentabilite(produitsNom, tauxRentabilite);

  // Afficher les top produits
  console.log(this.topProduits);
}

renderGraphTauxRentabilite(produitsNom: string[], tauxRentabilite: number[]): void {
  console.log(produitsNom, tauxRentabilite);

  const options = {
    chart: {
      height: 350,
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        endingShape: 'rounded',
        dataLabels: { position: 'top' },
      },
    },
    colors: ['#34D399'], // Vert pour la rentabilité
    series: [
      {
        name: 'Taux de Rentabilité (%)',
        data: tauxRentabilite,
      },
    ],
    dataLabels: { enabled: false },
    xaxis: {
      categories: produitsNom,
      labels: {
        style: { fontSize: '12px', colors: '#64748b' },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val.toFixed(2)}%`, // Affichage avec 2 décimales
        style: { color: '#64748b' },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(2)}%`,
      },
    },
    legend: {
      show: true,
      position: 'top',
      labels: { colors: '#64748b', fontSize: '12px' },
    },
  };

  const chartContainer = document.querySelector('#graph-taux-rentabilite');
  if (this.TauxRentabiliteChart) {
    this.TauxRentabiliteChart.destroy();
    this.TauxRentabiliteChart = null;
  }

  this.TauxRentabiliteChart = new ApexCharts(chartContainer, options);
  this.TauxRentabiliteChart.render();
}

  async calculerTopCategories() {
    // Regrouper les produits par catégorie
    const categoriesAvecRentabilite = await Promise.all(this.produits.map(async (produit) => {
      const categorieId = produit.categorie_id;  // Utiliser l'id de la catégorie (à partir de la table produit)

      // Initialiser les variables de la catégorie
      let totalVenteCategorie = 0;
      let totalCpvCategorie = 0;
      let totalBeneficeNetCategorie = 0;

      // Filtrer les articles pour ce produit
      const articlesPourCategorie = this.filteredTbArtcile.filter((article: { produit_id: number; }) => article.produit_id === produit.produit_id);
      
      // Calculer le chiffre d'affaires et le bénéfice net pour chaque article vendu
      for (const article of articlesPourCategorie) {
        const quantiteVendue = article.quantite;
        const prixUnitaire = parseFloat(article.prix_unitaire || '0');
        
        // Calcul du chiffre d'affaires pour cet article
        totalVenteCategorie += prixUnitaire * quantiteVendue;

        // Calcul du coût d'achat et du coût de revient pour cet article
        let coutAchatProduit, coutRevientProduit;
        
        // Vérifier si l'article est un produit variable (article.id !== 0)
        if (article.id !== 0) {
          // Récupérer la combinaison du produit variable
          const combinaison = await this.produitService.getCombinaisonById(article.produit_id).toPromise();
          coutAchatProduit = parseFloat(combinaison.message.prix_achat || '0');
          coutRevientProduit = parseFloat(combinaison.message.prix_de_revient || '0');
        } else {
          // Produit simple
          coutAchatProduit = Number(produit.prix_achat || '0');
          coutRevientProduit = Number(produit.prix_de_revient || '0');
        }

        // Calcul du coût des produits vendus (CPV) pour cet article
        const cpvProduit = coutRevientProduit * quantiteVendue;
        totalCpvCategorie += cpvProduit;

        // Calcul du bénéfice net pour cet article
        const beneficeNetProduit = (prixUnitaire * quantiteVendue) - cpvProduit;
        totalBeneficeNetCategorie += beneficeNetProduit;
      }

      // Calcul du taux de rentabilité pour la catégorie
      const tauxRentabiliteCategorie = totalCpvCategorie === 0 ? 0 : (totalBeneficeNetCategorie / totalCpvCategorie) * 100;

      return {
        categorieId: categorieId,  // On retourne l'ID de la catégorie pour pouvoir l'utiliser plus tard
        chiffreAffaires: totalVenteCategorie,
        beneficeNet: totalBeneficeNetCategorie,
        tauxRentabilite: tauxRentabiliteCategorie,
      };
    }));

    // Maintenant, on va regrouper par catégorie (categorieId)
    const categoriesParId: CategoryRentabilityMap = categoriesAvecRentabilite.reduce((acc, categorie) => {
      if (!acc[categorie.categorieId]) {
        acc[categorie.categorieId] = {
          categorieId: categorie.categorieId,
          chiffreAffaires: 0,
          beneficeNet: 0,
          tauxRentabilite: 0,
        };
      }

      acc[categorie.categorieId].chiffreAffaires += categorie.chiffreAffaires;
      acc[categorie.categorieId].beneficeNet += categorie.beneficeNet;
      acc[categorie.categorieId].tauxRentabilite = (acc[categorie.categorieId].beneficeNet / acc[categorie.categorieId].chiffreAffaires) * 100;

      return acc;
    }, {} as CategoryRentabilityMap); // Indiquer explicitement le type

    // Convertir l'objet en tableau et trier les catégories par rentabilité
    this.topCategories = Object.values(categoriesParId)
      .sort((a, b) => b.tauxRentabilite - a.tauxRentabilite) // Trier en fonction du taux de rentabilité
      .slice(0, 5); // Prendre les 5 premières catégories

    console.log('Top 5 Catégories les plus rentables:', this.topCategories);
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
}
