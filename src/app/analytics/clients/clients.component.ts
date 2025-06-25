import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ArticlesDeVentes,
  GetArticleDeVente,
} from 'src/app/Models/articlesDeVente.model';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { GetDepense } from 'src/app/Models/depenses.model';
import { PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { Utilisateur } from 'src/app/Models/users.model';
import { GetVente, Vente } from 'src/app/Models/vente.model';
import { ArticlesDeVenteService } from 'src/app/Services/articles-de-vente.service';
import { ClientsService } from 'src/app/Services/clients.service';
import { CommandeService } from 'src/app/Services/commande.service';
import { DepensesService } from 'src/app/Services/depenses.service';
import { GlobalService } from 'src/app/Services/global.service';
import { ProduitService } from 'src/app/Services/produit.service';
import { RapportService } from 'src/app/Services/rapport.service';
import { VenteService } from 'src/app/Services/vente.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent {
  dateDebut: any;
  dateFin: any;
  comparateur: any;
  chartInstanceNewClients: any;
  chartInstanceClientsRecurrents: any;
  chartInstanceClientsFideles: any;
  chartInstanceCLV: any;
  chartInstanceTypologieClients: any;

  Tbclients: Client[] = [];
  ventesOriginales: Vente[] = [];
  clvData: { client_id: number; clv: number }[] = [];
topClients: { client_id: number; montant: number }[] = [];

  totalNewClients: number = 0;
  totalClients: number = 0;
  totalClientsRecurrents: number = 0;
  totalClientsFideles: number = 0;
  panierMoyen: number = 0;

  constructor(
    private rapportService: RapportService,
    private router: Router,
    private venteService: VenteService,
    private dialog: MatDialog,
    private commandeService: CommandeService,
    private depenseService: DepensesService,
    private route: ActivatedRoute,
    private clientService: ClientsService,
    private produitService: ProduitService,
    private articleventeService: ArticlesDeVenteService,
    public globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.getListVente();
    this.getListClient();
  }

  getListClient() {
    const client: GetClient = { client_id: 0 };
    this.clientService.getListClient(client).subscribe((data) => {
      console.log(data.message);
      this.totalClients = data.message.length;
      this.Tbclients = data.message;
    });
  }

  getClientName(client_id: number): string {
    const client = this.Tbclients.find((c) => c.client_id === client_id);
    return client ? client.nom + ' ' + client.prenom : 'Unknown Client';
  }
  getListVente() {
    const vente: GetVente = { vente_id: 0 };
    this.venteService.getList(vente).subscribe((res) => {
      this.ventesOriginales = res.message;
      this.comparateur = 'cette_semaine';
      this.applyFilters();
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.ventesOriginales];

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
      case 'semaine_derniere':
        const sdStart = this.getStartOfLastWeek();
        const sdEnd = this.getEndOfLastWeek();
        filtered = filtered.filter(
          (v) =>
            new Date(v.date_vente) >= sdStart && new Date(v.date_vente) <= sdEnd
        );
        break;
      case 'cette_semaine':
        const csStart = this.getStartOfThisWeek();
        const csEnd = this.getEndOfThisWeek();
        filtered = filtered.filter(
          (v) =>
            new Date(v.date_vente) >= csStart && new Date(v.date_vente) <= csEnd
        );
        break;
      case 'mois':
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

    this.renderNewClients(filtered);
    this.renderClientsRecurrents(filtered);
    this.renderClientsFideles(filtered);
    this.renderCLVTable(filtered);
    this.panierMoyen = this.calculatePanierMoyen(filtered);
    this.topClients = this.getTopClientsByMontant(filtered);

    setTimeout(() => {
      this.renderRepartitionTypologieClients();
    }, 300);
  }

  getTopClientsByMontant(ventes: any[]): { client_id: number; montant: number }[] {
  const map = new Map<number, number>();

  ventes.forEach((v) => {
    const clientId = v.client_id;
    const montant = parseFloat(v.montant_total || '0');
    if (!clientId) return;

    if (map.has(clientId)) {
      map.set(clientId, map.get(clientId)! + montant);
    } else {
      map.set(clientId, montant);
    }
  });

  return Array.from(map.entries())
    .map(([client_id, montant]) => ({ client_id, montant }))
    .sort((a, b) => b.montant - a.montant)
    .slice(0, 5);
}


  private classifierClients(ventes: any[]): {
    nouveaux: number[];
    recurrents: number[];
    fideles: number[];
  } {
    const achatParClient: { [key: number]: number } = {};
    console.log(ventes);

    ventes.forEach((v) => {
      if (!v.client_id) return;
      achatParClient[v.client_id] = (achatParClient[v.client_id] || 0) + 1;
    });

    const nouveaux: number[] = [];
    const recurrents: number[] = [];
    const fideles: number[] = [];

    for (const [clientIdStr, count] of Object.entries(achatParClient)) {
      const clientId = Number(clientIdStr);
      if (count >= 6) {
        fideles.push(clientId);
      } else if (count >= 3) {
        recurrents.push(clientId);
      } else if (count >= 1) {
        nouveaux.push(clientId);
      }
    }
    console.log(nouveaux, recurrents, fideles);

    return { nouveaux, recurrents, fideles };
  }

  renderNewClients(ventes: any[]): void {
    if (!ventes || ventes.length === 0) ventes = [];

    const { nouveaux } = this.classifierClients(ventes);
    this.totalNewClients = nouveaux.length;

    const ventesNouveauxClients = ventes.filter((v) =>
      nouveaux.includes(v.client_id)
    );

    const clientsParDate: { [key: string]: Set<number> } = {};
    ventesNouveauxClients.forEach((v) => {
      const date = new Date(v.date_vente);
      const formattedDate = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      if (!clientsParDate[formattedDate]) {
        clientsParDate[formattedDate] = new Set();
      }
      clientsParDate[formattedDate].add(v.client_id);
    });

    const achatsParDate = Object.fromEntries(
      Object.entries(clientsParDate).map(([date, set]) => [date, set.size])
    );

    const categories = Object.keys(achatsParDate).sort((a, b) => {
      const [dA, mA, yA] = a.split('/').map(Number);
      const [dB, mB, yB] = b.split('/').map(Number);
      return (
        new Date(yA, mA - 1, dA).getTime() - new Date(yB, mB - 1, dB).getTime()
      );
    });

    const data = categories.map((date) => achatsParDate[date]);
    const maxValue = Math.max(...data);
    const tickAmount = maxValue < 5 ? 5 : maxValue;

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
      colors: ['#ff9900'],
      series: [{ name: 'Nouveaux clients', data }],
      dataLabels: { enabled: false },
      xaxis: {
        categories,
        labels: {
          style: { fontSize: '10px', colors: '#64748b' },
          rotate: -45,
          trim: true,
        },
      },
      yaxis: {
        min: 0,
        max: tickAmount,
        tickAmount,
        forceNiceScale: false,
        labels: {
          formatter: (val: number) => `${Math.round(val)}`,
          style: { color: '#64748b' },
        },
      },
      tooltip: {
        y: { formatter: (val: number) => `${val} nouveau(x) client(s)` },
      },
      legend: {
        show: true,
        position: 'top',
        labels: { colors: '#64748b', fontSize: '12px' },
      },
    };

    const chartContainer = document.querySelector('#new-clients-chart');
    if (this.chartInstanceNewClients) {
      this.chartInstanceNewClients.destroy();
      this.chartInstanceNewClients = null;
    }

    this.chartInstanceNewClients = new ApexCharts(chartContainer, options);
    this.chartInstanceNewClients.render();
  }

  renderClientsRecurrents(ventes: any[]): void {
    if (!ventes || ventes.length === 0) ventes = [];

    const { recurrents } = this.classifierClients(ventes);
    this.totalClientsRecurrents = recurrents.length;

    const ventesRecurrents = ventes.filter((v) =>
      recurrents.includes(v.client_id)
    );

    const clientsParDate: { [key: string]: Set<number> } = {};
    ventesRecurrents.forEach((v) => {
      const date = new Date(v.date_vente);
      const formattedDate = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      if (!clientsParDate[formattedDate])
        clientsParDate[formattedDate] = new Set();
      clientsParDate[formattedDate].add(v.client_id);
    });

    const achatsParDate = Object.fromEntries(
      Object.entries(clientsParDate).map(([date, set]) => [date, set.size])
    );

    const categories = Object.keys(achatsParDate).sort((a, b) => {
      const [dA, mA, yA] = a.split('/').map(Number);
      const [dB, mB, yB] = b.split('/').map(Number);
      return (
        new Date(yA, mA - 1, dA).getTime() - new Date(yB, mB - 1, dB).getTime()
      );
    });

    const data = categories.map((date) => achatsParDate[date]);
    const maxValue = Math.max(...data);

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
      colors: ['#3366cc'],
      series: [{ name: 'Clients récurrents', data }],
      dataLabels: { enabled: false },
      xaxis: {
        categories,
        labels: {
          style: { fontSize: '10px', colors: '#64748b' },
          rotate: -45,
          trim: true,
        },
      },
      yaxis: {
        min: 0,
        max: maxValue + 1,
        tickAmount: maxValue + 1,
        labels: {
          formatter: (val: number) => `${Math.round(val)}`,
          style: { color: '#64748b' },
        },
      },
      tooltip: {
        y: { formatter: (val: number) => `${val} client(s) récurrent(s)` },
      },
      legend: {
        show: true,
        position: 'top',
        labels: { colors: '#64748b', fontSize: '12px' },
      },
    };

    const chartContainer = document.querySelector('#clients-recurrent');
    if (this.chartInstanceClientsRecurrents) {
      this.chartInstanceClientsRecurrents.destroy();
      this.chartInstanceClientsRecurrents = null;
    }

    this.chartInstanceClientsRecurrents = new ApexCharts(
      chartContainer,
      options
    );
    this.chartInstanceClientsRecurrents.render();
  }

  renderClientsFideles(ventes: any[]): void {
    if (!ventes || ventes.length === 0) ventes = [];

    const { fideles } = this.classifierClients(ventes);
    this.totalClientsFideles = fideles.length;

    if (fideles.length === 0) return;

    const ventesFideles = ventes.filter((v) => fideles.includes(v.client_id));

    const clientsParDate: { [key: string]: Set<number> } = {};

    ventesFideles.forEach((v) => {
      const date = new Date(v.date_vente);
      const formattedDate = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      if (!clientsParDate[formattedDate]) {
        clientsParDate[formattedDate] = new Set();
      }
      clientsParDate[formattedDate].add(v.client_id);
    });

    const categories = Object.keys(clientsParDate).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/').map(Number);
      const [dayB, monthB, yearB] = b.split('/').map(Number);
      return (
        new Date(yearA, monthA - 1, dayA).getTime() -
        new Date(yearB, monthB - 1, dayB).getTime()
      );
    });

    const data = categories.map((date) => clientsParDate[date].size);
    const maxValue = Math.max(...data);

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
      colors: ['#28a745'],
      series: [
        {
          name: 'Clients fidèles',
          data,
        },
      ],
      dataLabels: { enabled: false },
      xaxis: {
        categories,
        labels: {
          style: { fontSize: '10px', colors: '#64748b' },
          rotate: -45,
          trim: true,
        },
      },
      yaxis: {
        min: 0,
        max: maxValue + 1,
        tickAmount: maxValue + 1,
        forceNiceScale: false,
        labels: {
          formatter: (val: number) => `${Math.round(val)}`,
          style: { color: '#64748b' },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) =>
            `${val} client(s) fidèle(s) ayant effectué des achats`,
        },
      },
      legend: {
        show: true,
        position: 'top',
        labels: { colors: '#64748b', fontSize: '12px' },
      },
    };

    const chartContainer = document.querySelector('#clients-fideles-chart');
    if (this.chartInstanceClientsFideles) {
      this.chartInstanceClientsFideles.destroy();
      this.chartInstanceClientsFideles = null;
    }

    this.chartInstanceClientsFideles = new ApexCharts(chartContainer, options);
    this.chartInstanceClientsFideles.render();
  }

  renderRepartitionTypologieClients(): void {
    if (
      this.totalClientsFideles !== undefined &&
      this.totalClientsRecurrents !== undefined &&
      this.totalNewClients !== undefined
    ) {
      const total =
        this.totalNewClients +
        this.totalClientsRecurrents +
        this.totalClientsFideles;

      const series =
        total > 0
          ? [
              (this.totalNewClients / total) * 100,
              (this.totalClientsRecurrents / total) * 100,
              (this.totalClientsFideles / total) * 100,
            ]
          : [0, 0, 0];

      const options = {
        chart: {
          width: 450,
          type: 'donut',
        },
        labels: ['Nouveaux clients', 'Clients récurrents', 'Clients fidèles'],
        series: series,
        dataLabels: {
          enabled: true,
          formatter: (val: number) => `${val.toFixed(1)}%`,
        },
        stroke: {
          width: 0,
        },
        colors: ['#ffa826', '#3366cc', '#28a745'],
        legend: {
          position: 'bottom',
          labels: {
            colors: '#64748b',
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: '75%',
            },
          },
        },
        tooltip: {
          y: {
            formatter: (val: number) => `${val.toFixed(1)}%`,
          },
        },
      };

      const chartContainer = document.querySelector('#donut-repartition');
      if (this.chartInstanceTypologieClients) {
        this.chartInstanceTypologieClients.destroy();
        this.chartInstanceTypologieClients = null;
      }

      this.chartInstanceTypologieClients = new ApexCharts(
        chartContainer,
        options
      );
      this.chartInstanceTypologieClients.render();
    }
  }

  renderCLVTable(ventes: any[]): void {
    if (!ventes || ventes.length === 0) return;

    // Regrouper les ventes par client_id et calculer la somme des montants
    const clvMap: { [key: number]: number } = {};

    ventes.forEach((vente) => {
      const clientId = vente.client_id;
      const montant = parseFloat(vente.montant_total || '0');
      if (!clvMap[clientId]) clvMap[clientId] = 0;
      clvMap[clientId] += montant;
    });

    // Transformer en tableau et trier par CLV décroissante
    this.clvData = Object.entries(clvMap)
      .map(([client_id, clv]) => ({
        client_id: Number(client_id),
        clv: Math.round(clv),
      }))
      .sort((a, b) => b.clv - a.clv);
  }

  calculatePanierMoyen(ventes: any[]): number {
    if (!ventes || ventes.length === 0) return 0;

    const total = ventes.reduce(
      (sum, v) => sum + parseFloat(v.montant_total || '0'),
      0
    );
    const panierMoyen = total / ventes.length;

    return Math.round(panierMoyen);
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
