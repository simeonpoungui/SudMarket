import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesDeVentes, GetArticleDeVente } from 'src/app/Models/articlesDeVente.model';
import { Client } from 'src/app/Models/clients.model';
import { GetDepense } from 'src/app/Models/depenses.model';
import { PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { Utilisateur } from 'src/app/Models/users.model';
import { GetVente, Vente } from 'src/app/Models/vente.model';
import { ArticlesDeVenteService } from 'src/app/Services/articles-de-vente.service';
import { CommandeService } from 'src/app/Services/commande.service';
import { DepensesService } from 'src/app/Services/depenses.service';
import { GlobalService } from 'src/app/Services/global.service';
import { ProduitService } from 'src/app/Services/produit.service';
import { RapportService } from 'src/app/Services/rapport.service';
import { VenteService } from 'src/app/Services/vente.service';

@Component({
  selector: 'app-ventes',
  templateUrl: './ventes.component.html',
  styleUrls: ['./ventes.component.scss'],
})
export class VentesComponent {
  dataSourceVente!: any;
  user!: Utilisateur;

  private chart: ApexCharts | undefined;

  displayedColumns = [
    'date_vente',
    'montant_total',
    'point_de_vente_id',
    'total_benefice_vente',
  ];

  IDuser!: number 
  IDclient!: number 
  IDpoint!: number 
  DateDebut!: string 
  DateFin!: string
  TotalVentesMois!: number;
  PanierMoyen: any = 0;
  joursPerformants: any = 0
  
  isloadingpage!: boolean
  selectedVenteString: string = ''
  tbUsers: Utilisateur[] = []
  tbClients: Client[] = [];
  ventes: Vente[] = []
  TotalMontant: any = 0
  TotalMontantBenefice!: number
  pointSelected!:PointsDeVentes;
  tbPointdeVente: PointsDeVentes[] = []
  produits: Produit[] = [];
  TotalVentes: any;
  chartInstanceVentes: any = null;
  chartInstanceChiffresAffaires: any = null;
  chartInstanceVentesNettes: any = null
  totalDepenses: number = 0;
  ventesNettes: number = 0;
  imageproduitArticle: { [key: number]: string } = {}; 



  constructor(
    private rapportService: RapportService,
    private router: Router,
    private venteService: VenteService,
    private dialog: MatDialog,
    private commandeService: CommandeService,
    private depenseService: DepensesService,
    private route: ActivatedRoute,
    private produitService: ProduitService,
    private articleventeService: ArticlesDeVenteService,
    public globalService: GlobalService
  ) {}

  dateDebut: string = '';
  dateFin: string = '';
  ventesOriginales: any[] = []; 

  TbArtcile: ArticlesDeVentes[] = []
  topArticles: any[] = [];

  comparateur: string = '';

  @ViewChild('chart', { static: true }) chartElement: ElementRef | undefined;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user = JSON.parse(utilisateurJson);
      console.log(this.user);
    }
    this.getListVente()
    this.getDepenses()
    this.getListeArticleDeVentes()
    this.getListProduit()
  }

  getListProduit() {
    const produit: GetProduit = { produit_id: 0 };
    this.produitService.getList(produit).subscribe(
      (data) => {
        this.produits = data.message
      }
    );
  }

  getProduitName(produit_id: number): string {
    const produit = this.produits.find(p => p.produit_id === produit_id);
    return produit ? (produit.nom ): '';
  }

  getListeArticleDeVentes() {
    const article: GetArticleDeVente = {
      article_de_vente_id: 0
    };
  
    this.articleventeService.getList(article).subscribe(res => {
      this.TbArtcile = res.message;
  
      const aggregationMap = new Map<number, any>();
  
      this.TbArtcile.forEach(article => {
        const produitId = article.produit_id;
        if (aggregationMap.has(produitId)) {
          const existing = aggregationMap.get(produitId);
          existing.quantite += article.quantite;
          existing.prix_total_vente += parseFloat(article.prix_total_vente);
          existing.benefice += Number(article.benefice ?? 0);
        } else {
          aggregationMap.set(produitId, {
            produit_id: produitId,
            quantite: article.quantite,
            prix_total_vente: parseFloat(article.prix_total_vente),
            benefice: Number(article.benefice ?? 0)
          });
        }
      });
  
      this.topArticles = Array.from(aggregationMap.values())
        .sort((a, b) => b.quantite - a.quantite)
        .slice(0, 10);
  
      // Récupérer les images pour les 10 produits
      this.topArticles.forEach(article => {
        this.getImageByproduiIDByArticle(article.produit_id);
      });
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

  getDepenses() {
    const depense: GetDepense = { id_depense: 0 };
    this.depenseService.getListDepenses(depense).subscribe((data) => {
      const depenses = data.message || [];
      this.totalDepenses = depenses.reduce((total, d) => total + Number(d.montant || '0'), 0);
      console.log(this.totalDepenses);
    });
  }

  getTotalVentes(ventes: any[]): number {
    return ventes.reduce((total, v) => total + Number(v.montant || '0'), 0);
  }

  onFilterChange() {
    this.applyFilters();
  } 

  getListVente() {
    this.isloadingpage = true;
    const vente: GetVente = { vente_id: 0 };
    this.venteService.getList(vente).subscribe(
      (data) => {
        this.ventesOriginales = data.message; 
        console.log(this.ventesOriginales); 
        if (this.ventesOriginales) {
          this.comparateur = "cette_semaine"
          this.applyFilters();
        } 
      },
      (error) => {
        console.error('Erreur dans la récupération des données:', error);
        this.isloadingpage = false;
      }
    );
  }

  applyFilters() {
    let filtered = [...this.ventesOriginales];
    console.log(filtered);
    
    // Filtrer par date de début
    if (this.dateDebut) {
      this.comparateur = ''
      filtered = filtered.filter(v => new Date(v.date_vente) >= new Date(this.dateDebut));
    }
  
    // Filtrer par date de fin
    if (this.dateFin) {
      this.comparateur = ''
      filtered = filtered.filter(v => new Date(v.date_vente) <= new Date(this.dateFin));
    }
  
    // Appliquer les filtres par comparateur
    const now = new Date();
    switch (this.comparateur) {
      case 'aujourdhui':
        filtered = filtered.filter(v =>
          this.isSameDate(new Date(v.date_vente), now)
        );
        break;
  
      case 'semaine_derniere': {
        const start = this.getStartOfLastWeek();
        const end = this.getEndOfLastWeek();
        filtered = filtered.filter(v =>
          new Date(v.date_vente) >= start && new Date(v.date_vente) <= end
        );
        break;
      }
  
      case 'cette_semaine': {
        const start = this.getStartOfThisWeek();
        const end = this.getEndOfThisWeek();
        filtered = filtered.filter(v =>
          new Date(v.date_vente) >= start && new Date(v.date_vente) <= end
        );
        break;
      }
  
      case 'mois': {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        filtered = filtered.filter(v => {
          const d = new Date(v.date_vente);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        break;
      }
    }
    
    console.log(filtered);
    
  
    this.analyserVentes(filtered)
    this.renderTotaVentes(filtered)
    this.renderchiffresaffaires(filtered); 
    this.renderVentesNettes(filtered)
    this.dataSourceVente = new MatTableDataSource(filtered);
    this.dataSourceVente.sort = this.sort;
    this.dataSourceVente.paginator = this.paginator;
  }

  renderchiffresaffaires(filteredVentes: any): void {
    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;

      // 👉 Calculer la période à partir des données filtrées
  if (filteredVentes.length > 0) {
    const dates = filteredVentes.map((v: any) => new Date(v.date_vente));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const formatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const periodeText = `Période du ${formatter.format(minDate)} au ${formatter.format(maxDate)}`;

    const periodeElement = document.getElementById("periode-affichage");
    if (periodeElement) {
      periodeElement.textContent = periodeText;
    }
  }

  
    const grouped: { [key: string]: { current: number; previous: number } } = {};
  
    // Étape 1 : Extraire les dates de filteredVentes
    filteredVentes.forEach((vente: any) => {
      const date = new Date(vente.date_vente);
      const dayMonth = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit',year:'numeric' });
  
      if (!grouped[dayMonth]) {
        grouped[dayMonth] = { current: 0, previous: 0 };
      }
  
      if (date.getFullYear() === currentYear) {
        grouped[dayMonth].current += Number(vente.montant_total);
      }
    });
  
    // Étape 2 : Chercher les données de l’année précédente UNIQUEMENT pour les mêmes jours/mois
    Object.keys(grouped).forEach(dayMonth => {
      const [day, month] = dayMonth.split('/');
  
      // Construire une date avec année précédente
      const dateString = `${previousYear}-${month}-${day}`;
      const previousDate = new Date(dateString);
  
      // Filtrer les ventes originales de l'année précédente correspondant à ce jour/mois
      const ventesPrecedentes = this.ventesOriginales.filter((vente: any) => {
        const venteDate = new Date(vente.date_vente);
        return (
          venteDate.getFullYear() === previousYear &&
          venteDate.getDate() === previousDate.getDate() &&
          venteDate.getMonth() === previousDate.getMonth()
        );
      });
  
      // Ajouter le total au champ `previous`
      ventesPrecedentes.forEach(vente => {
        grouped[dayMonth].previous += Number(vente.montant_total);
      });
    });
  
    // Étape 3 : Ordonner les dates
    const categories = Object.keys(grouped).sort((a, b) => {
      const [dayA, monthA] = a.split('/');
      const [dayB, monthB] = b.split('/');
      return new Date(`${currentYear}-${monthA}-${dayA}`).getTime() - new Date(`${currentYear}-${monthB}-${dayB}`).getTime();
    });
  
    const currentData = categories.map(date => grouped[date].current);
    const previousData = categories.map(date => grouped[date].previous);
  
    // Étape 4 : Graphique
    const options = {
      chart: {
        height: 350,
        width: '100%',
        type: 'bar',
        stacked: false,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
          endingShape: 'rounded',
          dataLabels: { position: 'top' },
        },
      },
      colors: ['#3454D1', '#94a3b8'],
      series: [
        {
          name: `Montant ${currentYear}`,
          data: currentData,
        },
        {
          name: `Montant ${previousYear}`,
          data: previousData,
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
          formatter: (val: number) => `${val}K`,
          style: { color: '#64748b' },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}K`,
        },
      },
      legend: {
        show: true,
        position: 'top',
        labels: { colors: '#64748b', fontSize: '12px' },
      },
    };
  
    const chartContainer = document.querySelector('#chiffres-affaires');
    if (this.chartInstanceChiffresAffaires) {
      this.chartInstanceChiffresAffaires.destroy();
      this.chartInstanceChiffresAffaires = null;
    }
    
    this.chartInstanceChiffresAffaires = new ApexCharts(chartContainer, options);
    this.chartInstanceChiffresAffaires.render();
    
  }

  renderTotaVentes(filteredVentes: any): void {
    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;
          // 👉 Calculer la période à partir des données filtrées
  if (filteredVentes.length > 0) {
    const dates = filteredVentes.map((v: any) => new Date(v.date_vente));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const formatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const periodeText = `Période du ${formatter.format(minDate)} au ${formatter.format(maxDate)}`;

    const periodeElement = document.getElementById("periode-affichage2");
    if (periodeElement) {
      periodeElement.textContent = periodeText;
    }
  }
  
    const grouped: { [key: string]: { current: number; previous: number } } = {};
  
    // Étape 1 : Grouper par jour/mois uniquement les ventes filtrées
    filteredVentes.forEach((vente: any) => {
      const date = new Date(vente.date_vente);
      const dayMonth = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
      if (!grouped[dayMonth]) {
        grouped[dayMonth] = { current: 0, previous: 0 };
      }
  
      if (date.getFullYear() === currentYear) {
        grouped[dayMonth].current += 1; // 👈 On compte les ventes
      }
    });
  
    // Étape 2 : Ajouter le nombre de ventes pour les mêmes jours de l'année précédente
    Object.keys(grouped).forEach(dayMonth => {
      const [day, month] = dayMonth.split('/');
  
      const dateString = `${previousYear}-${month}-${day}`;
      const previousDate = new Date(dateString);
  
      const ventesPrecedentes = this.ventesOriginales.filter((vente: any) => {
        const venteDate = new Date(vente.date_vente);
        return (
          venteDate.getFullYear() === previousYear &&
          venteDate.getDate() === previousDate.getDate() &&
          venteDate.getMonth() === previousDate.getMonth()
        );
      });
  
      ventesPrecedentes.forEach(() => {
        grouped[dayMonth].previous += 1; // 👈 Compte aussi les ventes précédentes
      });
    });
  
    // Étape 3 : Trier les dates pour l'affichage
    const categories = Object.keys(grouped).sort((a, b) => {
      const [dayA, monthA] = a.split('/');
      const [dayB, monthB] = b.split('/');
      return new Date(`${currentYear}-${monthA}-${dayA}`).getTime() - new Date(`${currentYear}-${monthB}-${dayB}`).getTime();
    });
  
    const currentData = categories.map(date => grouped[date].current);
    const previousData = categories.map(date => grouped[date].previous);
  
    // Étape 4 : Config du graphique (identique, juste adapter le Y en "unités")
    const options = {
      chart: {
        height: 350,
        width: '100%',
        type: 'bar',
        stacked: false,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
          endingShape: 'rounded',
          dataLabels: { position: 'top' },
        },
      },
      colors: ['#3454D1', '#94a3b8'],
      series: [
        {
          name: `Ventes ${currentYear}`,
          data: currentData,
        },
        {
          name: `Ventes ${previousYear}`,
          data: previousData,
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
          formatter: (val: number) => `${val}`,
          style: { color: '#64748b' },
        },
        // title: {
        //   text: 'Nombre de ventes',
        //   style: { color: '#64748b', fontSize: '12px' },
        // },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} ventes`,
        },
      },
      legend: {
        show: true,
        position: 'top',
        labels: { colors: '#64748b', fontSize: '12px' },
      },
    };
  
    const chartContainer = document.querySelector('#TotalVentes');
    if (this.chartInstanceVentes) {
      this.chartInstanceVentes.destroy();
      this.chartInstanceVentes = null;
    }
    
    this.chartInstanceVentes = new ApexCharts(chartContainer, options);
    this.chartInstanceVentes.render();
    
  }

  renderVentesNettes(filteredVentes: any): void {
    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;

          // 👉 Calculer la période à partir des données filtrées
  if (filteredVentes.length > 0) {
    const dates = filteredVentes.map((v: any) => new Date(v.date_vente));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const formatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const periodeText = `Période du ${formatter.format(minDate)} au ${formatter.format(maxDate)}`;

    const periodeElement = document.getElementById("periode-affichage3");
    if (periodeElement) {
      periodeElement.textContent = periodeText;
    }
  }
  
    const grouped: { [key: string]: { current: number; previous: number } } = {};
  
    // Étape 1 : Grouper par jour/mois uniquement les ventes filtrées
    filteredVentes.forEach((vente: any) => {
      const date = new Date(vente.date_vente);
      const dayMonth = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
      if (!grouped[dayMonth]) {
        grouped[dayMonth] = { current: 0, previous: 0 };
      }
  
      if (date.getFullYear() === currentYear) {
        grouped[dayMonth].current += 1; // 👈 On compte les ventes
      }
    });
  
    // Étape 2 : Ajouter le nombre de ventes pour les mêmes jours de l'année précédente
    Object.keys(grouped).forEach(dayMonth => {
      const [day, month] = dayMonth.split('/');
  
      const dateString = `${previousYear}-${month}-${day}`;
      const previousDate = new Date(dateString);
  
      const ventesPrecedentes = this.ventesOriginales.filter((vente: any) => {
        const venteDate = new Date(vente.date_vente);
        return (
          venteDate.getFullYear() === previousYear &&
          venteDate.getDate() === previousDate.getDate() &&
          venteDate.getMonth() === previousDate.getMonth()
        );
      });
  
      ventesPrecedentes.forEach(() => {
        grouped[dayMonth].previous += 1; // 👈 Compte aussi les ventes précédentes
      });
    });
  
    // Étape 3 : Trier les dates pour l'affichage
    const categories = Object.keys(grouped).sort((a, b) => {
      const [dayA, monthA] = a.split('/');
      const [dayB, monthB] = b.split('/');
      return new Date(`${currentYear}-${monthA}-${dayA}`).getTime() - new Date(`${currentYear}-${monthB}-${dayB}`).getTime();
    });
  
    const currentData = categories.map(date => grouped[date].current);
    const previousData = categories.map(date => grouped[date].previous);
  
    // Étape 4 : Config du graphique (identique, juste adapter le Y en "unités")
    const options = {
      chart: {
        height: 350,
        width: '100%',
        type: 'bar',
        stacked: false,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
          endingShape: 'rounded',
          dataLabels: { position: 'top' },
        },
      },
      colors: ['#3454D1', '#94a3b8'],
      series: [
        {
          name: `Ventes ${currentYear}`,
          data: currentData,
        },
        {
          name: `Ventes ${previousYear}`,
          data: previousData,
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
          formatter: (val: number) => `${val}`,
          style: { color: '#64748b' },
        },
        // title: {
        //   text: 'Ventes nettes',
        //   style: { color: '#64748b', fontSize: '12px' },
        // },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} ventes`,
        },
      },
      legend: {
        show: true,
        position: 'top',
        labels: { colors: '#64748b', fontSize: '12px' },
      },
    };
  
    const chartContainer = document.querySelector('#VentesNettes');
    if (this.chartInstanceVentesNettes) {
      this.chartInstanceVentesNettes.destroy();
      this.chartInstanceVentesNettes = null;
    }
    
    this.chartInstanceVentesNettes = new ApexCharts(chartContainer, options);
    this.chartInstanceVentesNettes.render();
    
  }
  
  
  analyserVentes(data: any): void {
    console.log(data);
    
    const toutesLesVentes = data;
    console.log(toutesLesVentes);
    
    // Log pour vérifier les ventes reçues
    console.log(toutesLesVentes);
  
    // Calculer la somme des montants
    this.TotalMontant = toutesLesVentes.reduce((acc: number, vente: { montant_total: any; }) => acc + Number(vente.montant_total), 0);
  
    // Log pour vérifier le TotalMontant
    console.log(this.TotalMontant);
  
    // Calculer le nombre total des ventes
    this.TotalVentes = toutesLesVentes.length;
  
    // Log pour vérifier le nombre total des ventes
    console.log(this.TotalVentes);
  
    // Calculer le panier moyen
    this.PanierMoyen = this.TotalVentes > 0 ? (this.TotalMontant / this.TotalVentes) : 0;
  
    // Log pour vérifier le PanierMoyen
    console.log(this.PanierMoyen);
  
    // Calculer les ventes par jour
    const ventesParJour: { [key: string]: number } = toutesLesVentes.reduce((acc: { [x: string]: number; }, vente: { date_vente: string | number | Date; montant_total: any; }) => {
      const date = new Date(vente.date_vente).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += Number(vente.montant_total);
      return acc;
    }, {} as { [key: string]: number });
  
    // Log pour vérifier les ventes par jour
    console.log(ventesParJour);
  
    // Calculer la moyenne des ventes par jour
    const totalVentesParJour = Object.values(ventesParJour).reduce((acc, vente) => acc + vente, 0);
    const nombreDeJours = Object.keys(ventesParJour).length;
    const moyenneVentesParJour = totalVentesParJour / nombreDeJours;
  
    // Log pour vérifier la moyenne des ventes par jour
    console.log(moyenneVentesParJour);
  
    // Identifier les jours performants
    const joursPerformants = Object.keys(ventesParJour).filter(date => ventesParJour[date] > moyenneVentesParJour);
  
    // Log pour afficher les jours performants
    console.log(joursPerformants);
  
    // Total des ventes des jours performants
    const totalVentesJoursPerformants = joursPerformants.reduce((acc, date) => acc + ventesParJour[date], 0);
  
    // Log pour afficher le total des ventes des jours performants
    console.log(totalVentesJoursPerformants);
  
    // Affecter les données à la table
    this.isloadingpage = false;
    this.ventes = toutesLesVentes;
  
    // Log pour vérifier que les données sont affectées à la table
    console.log(this.ventes);
        // Vérifier si des données sont présentes
        if (!data || data.length === 0) {
          this.globalService.toastShow("Aucune vente disponible.","Infos",'info')
          this.isloadingpage = false;
        }
      
  }
  
  isSameDate(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
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
    return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 23, 59, 59);
  }
  
  getStartOfLastWeek(): Date {
    const d = this.getStartOfThisWeek();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7);
  }
  
  getEndOfLastWeek(): Date {
    const d = this.getStartOfThisWeek();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, 23, 59, 59);
  }

initChart(): void {
  if (this.chartElement) {
    this.chart = new ApexCharts(
      this.chartElement.nativeElement,
      this.barChartOptions
    );
    this.chart.render();
  }
}

public barChartData = {
  labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
  datasets: [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
  ],
};

public barChartOptions: any = {
  chart: {
    type: 'bar',
    height: 300,
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: this.barChartData.labels,
  },
  series: [
    {
      name: 'Series A',
      data: this.barChartData.datasets[0].data,
    },
    {
      name: 'Series B',
      data: this.barChartData.datasets[1].data,
    },
  ],
  plotOptions: {
    bar: {
      dataLabels: {
        position: '',
        enabled: false,
      },
    },
  },
  tooltip: {
    enabled: true,
    shared: false,
    intersect: true,
    y: {
      formatter: function (val: number) {
        return val;
      },
    },
  },
};

}
