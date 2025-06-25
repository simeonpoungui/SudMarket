import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { DepensesService } from 'src/app/Services/depenses.service';
import { Depense, GetDepense } from 'src/app/Models/depenses.model';
import {
  GetPointsDeVentes,
  PointsDeVentes,
} from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-depenses',
  templateUrl: './depenses.component.html',
  styleUrls: ['./depenses.component.scss'],
})
export class DepensesComponent {
  selectedFournisseurString: string = '';
  nbrefournisseur: number = 0;
  user!: Utilisateur;
  tbPointdeVente: PointsDeVentes[] = [];
  tbUsers: Utilisateur[] = [];
  Tbcategorie: any[] = [];
  tbSousCategories: any[] = [];
  depensesOriginales: Depense[] = [];
  DepenseCategorie: any[] = [];

  totalExpenses!: number;
  fixedCosts!: number;
  variableCosts!: number;
  cogs!: number;
  dateDebut: any;
  dateFin: any;
  comparateur: any;

  chartInstanceDepenses: any = null;
  chartInstanceChargesFixes: any = null;
  chartInstanceDonutCharges: any = null
  chartInstanceChargesVariables: any = null;

  constructor(
    private depenseService: DepensesService,
    private router: Router,
    private pointService: PointsDeVentesService,
    private categorieDepenseService: DepensesService,
    public globalService: GlobalService,
    private userService: UsersService,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getDepenses();
    this.loadCategorie();
  }

  loadCategorie() {
    this.categorieDepenseService
      .getListCategoriesDepenses(0)
      .subscribe((res) => {
        console.log(res.message);
        this.Tbcategorie = res.message;
        console.log(this.Tbcategorie);
      });
  }

  onFilterChange() {
    this.applyDepenseFilters();
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

  applyDepenseFilters() {
    let filtered = [...this.depensesOriginales];
    console.log(filtered);

    // Filtrer par date de début
    if (this.dateDebut) {
      this.comparateur = '';
      filtered = filtered.filter(
        (d) => new Date(d.date_heure) >= new Date(this.dateDebut)
      );
    }

    // Filtrer par date de fin
    if (this.dateFin) {
      this.comparateur = '';
      filtered = filtered.filter(
        (d) => new Date(d.date_heure) <= new Date(this.dateFin)
      );
    }

    // Appliquer les filtres par comparateur
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

    console.log(filtered);
    this.calculerTotauxDepenses(filtered);
    this.renderDepenses(filtered);
    this.renderDepensesChargesFixes(filtered);
    this.renderDepensesChargesVariables(filtered);
    this.renderDonutDepensesFixesVariablesMarchandises(filtered)
  }

  renderDepenses(filteredDepenses: any): void {
    const now = new Date();
    const currentYear = now.getFullYear();
    if (filteredDepenses.length > 0) {
      const dates = filteredDepenses.map((v: any) => new Date(v.date_heure));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
  
      const formatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const periodeText = `Période du ${formatter.format(minDate)} au ${formatter.format(maxDate)}`;
  
      const periodeElement = document.getElementById("periode-affichage1");
      if (periodeElement) {
        periodeElement.textContent = periodeText;
      }
    }
    // 👉 Calculer la période à partir des données filtrées
    if (filteredDepenses.length > 0) {
      const dates = filteredDepenses.map(
        (dep: any) => new Date(dep.date_heure)
      );
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));

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
    }

    const grouped: { [key: string]: number } = {};

    // Étape 1 : Extraire les dates de filteredDepenses
    filteredDepenses.forEach((dep: any) => {
      const date = new Date(dep.date_heure);
      const dayMonth = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      if (!grouped[dayMonth]) {
        grouped[dayMonth] = 0;
      }

      // Ajouter le montant de la dépense
      grouped[dayMonth] += Number(dep.montant);
    });

    // Étape 2 : Ordonner les dates
    const categories = Object.keys(grouped).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/');
      const [dayB, monthB, yearB] = b.split('/');
      return (
        new Date(`${yearA}-${monthA}-${dayA}`).getTime() -
        new Date(`${yearB}-${monthB}-${dayB}`).getTime()
      );
    });

    // Convertir les montants en "K" (milliers)
    const depensesData = categories.map((date) => grouped[date] / 1000); // Diviser par 1000 pour obtenir les valeurs en K

    // Étape 3 : Graphique
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
      colors: ['#FF5733'], // Vous pouvez ajuster la couleur à votre préférence
      series: [
        {
          name: `Dépenses ${currentYear}`,
          data: depensesData,
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
          formatter: (val: number) => `${val}K`, // Affichage des montants en K
          style: { color: '#64748b' },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}K`, // Affichage des montants en K dans les tooltips
        },
      },
      legend: {
        show: true,
        position: 'top',
        labels: { colors: '#64748b', fontSize: '12px' },
      },
    };

    const chartContainer = document.querySelector('#depenses-chart');
    if (this.chartInstanceDepenses) {
      this.chartInstanceDepenses.destroy();
      this.chartInstanceDepenses = null;
    }

    this.chartInstanceDepenses = new ApexCharts(chartContainer, options);
    this.chartInstanceDepenses.render();
  }

  renderDepensesChargesFixes(filteredDepensesChargesFixes: any): void {
    console.log(filteredDepensesChargesFixes);

    if (filteredDepensesChargesFixes.length > 0) {
      const dates = filteredDepensesChargesFixes.map((v: any) => new Date(v.date_heure));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
  
      const formatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const periodeText = `Période du ${formatter.format(minDate)} au ${formatter.format(maxDate)}`;
  
      const periodeElement = document.getElementById("periode-affichage21");
      if (periodeElement) {
        periodeElement.textContent = periodeText;
      }
    }
    const now = new Date();
    const currentYear = now.getFullYear();

    this.categorieDepenseService
      .getListCategoriesDepenses(0)
      .subscribe((res) => {
        console.log(res.message);
        this.DepenseCategorie = res.message;
        console.log(this.DepenseCategorie);

        const chargesFixesCategory = this.DepenseCategorie.find(
          (categorie: any) => categorie.nom_categorie == 'Charges fixes'
        );
        if (!chargesFixesCategory) {
          console.error('Catégorie "Charges fixes" non trouvée');
          this.DepenseCategorie  = []
          return; // Si "Charges fixes" n'existe pas dans DepenseCategorie, on arrête l'exécution.
        }

        const chargesFixesId = chargesFixesCategory.id_categorie;
        // Étape 2 : Filtrer les dépenses qui correspondent à cette catégorie
        const chargesFixesDepenses = filteredDepensesChargesFixes.filter(
          (dep: any) => dep.id_categorie === chargesFixesId
        );

        console.log(chargesFixesDepenses);

        if (!chargesFixesDepenses) {
          this.globalService.toastShow("Aucune dépense pour la catégorie Charges fixes","Infos", 'info')
          return; // Si aucune dépense n'est associée à "Charges fixes", on arrête l'exécution.
        }

        const grouped: { [key: string]: number } = {};

        // Étape 3 : Grouper les dépenses par jour/mois
        chargesFixesDepenses.forEach((dep: any) => {
          const date = new Date(dep.date_heure);
          const dayMonth = date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });

          if (!grouped[dayMonth]) {
            grouped[dayMonth] = 0;
          }
          console.log(chargesFixesDepenses);
          

          // Ajouter le montant de la dépense
          grouped[dayMonth] += Number(dep.montant);
        });

        // Étape 4 : Ordonner les dates
        const categories = Object.keys(grouped).sort((a, b) => {
          const [dayA, monthA, yearA] = a.split('/');
          const [dayB, monthB, yearB] = b.split('/');
          return (
            new Date(`${yearA}-${monthA}-${dayA}`).getTime() -
            new Date(`${yearB}-${monthB}-${dayB}`).getTime()
          );
        });

        // Étape 5 : Convertir les montants en "K" (milliers)
        const depensesData = categories.map((date) => grouped[date] / 1000); // Diviser par 1000 pour obtenir les valeurs en K
        console.log(depensesData);
        

        // Étape 6 : Créer le graphique
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
          colors: ['#3454D1'], // Couleur de la barre
          series: [
            {
              name: `Charges fixes ${currentYear}`,
              data: depensesData,
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
              formatter: (val: number) => `${val}K`, // Affichage des montants en K
              style: { color: '#64748b' },
            },
          },
          tooltip: {
            y: {
              formatter: (val: number) => `${val}K`, // Affichage des montants en K dans les tooltips
            },
          },
          legend: {
            show: true,
            position: 'top',
            labels: { colors: '#64748b', fontSize: '12px' },
          },
        };

        const chartContainer = document.querySelector('#charges-fixes-chart');
        if (this.chartInstanceChargesFixes) {
          this.chartInstanceChargesFixes.destroy();
          this.chartInstanceChargesFixes = null;
        }

        this.chartInstanceChargesFixes = new ApexCharts(
          chartContainer,
          options
        );
        this.chartInstanceChargesFixes.render();
      });
  }

  renderDepensesChargesVariables(filteredDepenses: any): void {
    const now = new Date();
    const currentYear = now.getFullYear();
    if (filteredDepenses.length > 0) {
      const dates = filteredDepenses.map((v: any) => new Date(v.date_heure));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
  
      const formatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const periodeText = `Période du ${formatter.format(minDate)} au ${formatter.format(maxDate)}`;
  
      const periodeElement = document.getElementById("periode-affichage31");
      if (periodeElement) {
        periodeElement.textContent = periodeText;
      }
    }
    this.categorieDepenseService
      .getListCategoriesDepenses(0)
      .subscribe((res) => {
        console.log(res.message);
        this.DepenseCategorie = res.message;
        console.log(this.DepenseCategorie);

        // Étape 1 : Trouver la catégorie "Charges variables"
        const chargesVariablesCategory = this.DepenseCategorie.find(
          (categorie: any) => categorie.nom_categorie === 'Charges variables'
        );
        if (!chargesVariablesCategory) {
          console.error('Catégorie "Charges variables" non trouvée');
          return; // Si "Charges variables" n'existe pas dans DepenseCategorie, on arrête l'exécution.
        }

        const chargesVariablesId = chargesVariablesCategory.id_categorie;

        // Étape 2 : Filtrer les dépenses qui correspondent à cette catégorie
        const chargesVariablesDepenses = filteredDepenses.filter(
          (dep: any) => dep.id_categorie === chargesVariablesId
        );

        if (!chargesVariablesDepenses) {
          this.globalService.toastShow("Aucune dépense pour la catégorie Charges variables","Infos", 'info')
          return;
        }

        const grouped: { [key: string]: number } = {};

        // Étape 3 : Grouper les dépenses par jour/mois
        chargesVariablesDepenses.forEach((dep: any) => {
          const date = new Date(dep.date_heure);
          const dayMonth = date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });

          if (!grouped[dayMonth]) {
            grouped[dayMonth] = 0;
          }

          // Ajouter le montant de la dépense
          grouped[dayMonth] += Number(dep.montant);
        });

        // Étape 4 : Ordonner les dates
        const categories = Object.keys(grouped).sort((a, b) => {
          const [dayA, monthA, yearA] = a.split('/');
          const [dayB, monthB, yearB] = b.split('/');
          return (
            new Date(`${yearA}-${monthA}-${dayA}`).getTime() -
            new Date(`${yearB}-${monthB}-${dayB}`).getTime()
          );
        });

        // Étape 5 : Convertir les montants en "K" (milliers)
        const depensesData = categories.map((date) => grouped[date] / 1000); // Diviser par 1000 pour obtenir les valeurs en K

        // Étape 6 : Créer le graphique
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
          colors: ['#41b2c4'], // Couleur de la barre pour "Charges variables"
          series: [
            {
              name: `Charges variables ${currentYear}`,
              data: depensesData,
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
              formatter: (val: number) => `${val}K`, // Affichage des montants en K
              style: { color: '#64748b' },
            },
          },
          tooltip: {
            y: {
              formatter: (val: number) => `${val}K`, // Affichage des montants en K dans les tooltips
            },
          },
          legend: {
            show: true,
            position: 'top',
            labels: { colors: '#64748b', fontSize: '12px' },
          },
        };

        const chartContainer = document.querySelector(
          '#charges-variables-chart'
        );
        if (this.chartInstanceChargesVariables) {
          this.chartInstanceChargesVariables.destroy();
          this.chartInstanceChargesVariables = null;
        }

        this.chartInstanceChargesVariables = new ApexCharts(
          chartContainer,
          options
        );
        this.chartInstanceChargesVariables.render();
      });
  }

  renderDonutDepensesFixesVariablesMarchandises(filteredDepenses: any): void {
    console.log(filteredDepenses);
    if (filteredDepenses.length > 0) {
      const dates = filteredDepenses.map((v: any) => new Date(v.date_heure));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
  
      const formatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const periodeText = `Période du ${formatter.format(minDate)} au ${formatter.format(maxDate)}`;
  
      const periodeElement = document.getElementById("periode-affichage4");
      if (periodeElement) {
        periodeElement.textContent = periodeText;
      }
    }

    this.categorieDepenseService.getListCategoriesDepenses(0).subscribe(res => {
      this.DepenseCategorie = res.message;
      console.log(this.DepenseCategorie);
  
      // Trouver les catégories
      const catFixes = this.DepenseCategorie.find((cat: any) => cat.nom_categorie.toLowerCase() === 'charges fixes');
      const catVariables = this.DepenseCategorie.find((cat: any) => cat.nom_categorie.toLowerCase() === 'charges variables');
      const catMarchandises = this.DepenseCategorie.find((cat: any) => cat.nom_categorie.toLowerCase() === 'marchandises');
    
      if (!catFixes || !catVariables || !catMarchandises) {
        console.error('Une ou plusieurs catégories ("Charges fixes", "Charges variables", "Marchandises") non trouvée');
        return;
      }
    
      const idFixes = catFixes.id_categorie;
      const idVariables = catVariables.id_categorie;
      const idMarchandises = catMarchandises.id_categorie;
  
      // Filtrer les dépenses pour chaque catégorie
      const depFixes = filteredDepenses.filter((dep: any) => dep.id_categorie === idFixes);
      const depVariables = filteredDepenses.filter((dep: any) => dep.id_categorie === idVariables);
      const depMarchandises = filteredDepenses.filter((dep: any) => dep.id_categorie === idMarchandises);
    
      // Calculer les totaux pour chaque catégorie
      const totalFixes = depFixes.reduce((acc: number, dep: any) => acc + Number(dep.montant), 0);
      const totalVariables = depVariables.reduce((acc: number, dep: any) => acc + Number(dep.montant), 0);
      const totalMarchandises = depMarchandises.reduce((acc: number, dep: any) => acc + Number(dep.montant), 0);
      console.log(totalFixes,totalVariables,totalMarchandises);
      
      const totalGlobal = totalFixes + totalVariables + totalMarchandises;
  
      // S'assurer qu'il y a des données
      if (!totalGlobal) {
        console.log("Aucune dépense à afficher pour le donut.");
        this.globalService.toastShow("Aucune dépense à afficher pour le donut.","Infos", 'info')
      }
  
      // Calculer les pourcentages
      const series = [
        (totalFixes / totalGlobal) * 100,
        (totalVariables / totalGlobal) * 100,
        (totalMarchandises / totalGlobal) * 100,
      ];
      console.log(series);
      
  
      // Options du graphique
      const options = {
        chart: {
          width: 500,
          type: "donut",
        },
        labels: ["Charges fixes", "Charges variables", "Marchandises"],
        series: series,
        dataLabels: {
          enabled: true,
          formatter: function (val: number) {
            return val.toFixed(1) + "%";
          },
        },
        stroke: {
          width: 0,
        },
        colors: ["#FF9F43", "#3454D1", "#28A745"], // Couleur pour "Marchandises" (vert)
        legend: {
          position: "bottom",
          labels: {
            colors: '#64748b',
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: "75%",
            },
          },
        },
        tooltip: {
          y: {
            formatter: function (val: number) {
              return val.toFixed(1) + "%";
            },
          },
          style: {
            fontSize: "12px",
            fontFamily: "Inter",
          },
        },
      };
  
      // Initialisation et rendu du graphique
      const chartContainer = document.querySelector('#donut-depenses-fixes-variables-marchandises');
      if (this.chartInstanceDonutCharges) {
        this.chartInstanceDonutCharges.destroy();
        this.chartInstanceDonutCharges = null;
      }
  
      this.chartInstanceDonutCharges = new ApexCharts(chartContainer, options);
      this.chartInstanceDonutCharges.render();
    });
  }
  
  
  calculerTotauxDepenses(depenses: any[]) {
    this.categorieDepenseService
      .getListCategoriesDepenses(0)
      .subscribe((res) => {
        console.log(res.message);
        this.Tbcategorie = res.message;
        console.log(this.Tbcategorie);

        // Vérifier s'il y a des données
        if (!depenses || depenses.length === 0) {
          this.globalService.toastShow('Aucune dépense à analyser.', 'Infos', 'info');
          this.totalExpenses = 0;
          this.fixedCosts = 0;
          this.variableCosts = 0;
          this.cogs = 0;
          return; // On arrête la fonction ici
        }

        // Initialisation des totaux
        let totalExpenses = 0;
        let fixedCosts = 0;
        let variableCosts = 0;
        let cogs = 0;

        // Associer les catégories par id_categorie
        const categoriesMap = new Map<number, string>();

        this.Tbcategorie.forEach((categorie) => {
          categoriesMap.set(categorie.id_categorie, categorie.nom_categorie);
        });

        console.log('categoriesMap:', categoriesMap);

        // Parcourir les dépenses pour calculer les totaux
        depenses.forEach((depense) => {
          console.log('id_categorie dans depense:', depense.id_categorie);

          const montant = Number(depense.montant);
          totalExpenses += montant;

          const categoryName = categoriesMap.get(depense.id_categorie);

          if (categoryName) {
            console.log('Category found:', categoryName);
            if (categoryName === 'Charges fixes') {
              fixedCosts += montant;
            } else if (categoryName === 'Charges variables') {
              variableCosts += montant;
            } else if (categoryName === "Coût d'acquisition") {
              cogs += montant;
            }
          } else {
            this.globalService.toastShow(
              'Catégorie inconnue pour une dépense.',
              'Infos',
              'info'
            );
          }
        });

        // Affecter les totaux pour affichage
        this.totalExpenses = totalExpenses;
        this.fixedCosts = fixedCosts;
        this.variableCosts = variableCosts;
        this.cogs = cogs;
        console.log(fixedCosts);
      });
  }

  getCategorieName(id_categorie: number): string {
    const c = this.Tbcategorie.find((u) => u.id_categorie === id_categorie);
    return c ? c.nom_categorie : 'Unknown Categorie';
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
