import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  ArticlesDeVentes,
  GetArticleDeVente,
} from 'src/app/Models/articlesDeVente.model';
import { Client, GetClient } from 'src/app/Models/clients.model';
import {
  GetPointsDeVentes,
  PointsDeVentes,
} from 'src/app/Models/pointsDeVentes.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { GetVente, Vente } from 'src/app/Models/vente.model';
import { ArticlesDeVenteService } from 'src/app/Services/articles-de-vente.service';
import { ClientsService } from 'src/app/Services/clients.service';
import { GlobalService } from 'src/app/Services/global.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { UsersService } from 'src/app/Services/users.service';
import { VenteService } from 'src/app/Services/vente.service';

@Component({
  selector: 'app-rentabilite',
  templateUrl: './rentabilite.component.html',
  styleUrls: ['./rentabilite.component.scss'],
})
export class RentabiliteComponent {
  dataSource!: any;
  displayedColumns = [
    'date_vente',
    'montant_total',
    'client_id',
    'utilisateur_id',
    'point_de_vente_id',
    'total_benefice_vente',
  ];

  user!: Utilisateur;
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

  ventes!: Vente[];
  articlesventes!: ArticlesDeVentes[];
  tbUsers: Utilisateur[] = [];
  tbClients: Client[] = [];
  tbPointdeVente!: PointsDeVentes[];

  isloadingpage!: boolean;
  MontantTotalVengteJournalier: any;
  MontantTotalBenefice: any;
  sort: any;
  paginator: any;
  TotalMontant!: number;
  TotalMontantBenefice!: number;

  isloadingtable!: boolean;
  isloadingState!: boolean;

  totalBeneficesJourActuel!: number;
  totalBeneficesJourPrecedent!: number;
  totalBeneficesMoisActuel!: number;
  totalBeneficesMoisPrecedent!: number;
  totalBeneficesAnneeActuelle!: number;
  totalBeneficesAnneePrecedent!: number;

  constructor(
    private venteService: VenteService,
    private articleService: ArticlesDeVenteService,
    public globalService: GlobalService,
    private clientService: ClientsService,
    private pointService: PointsDeVentesService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user = JSON.parse(utilisateurJson);
      console.log(this.user);
    }
    this.getListVente();
    this.loadPointDeVente();
    this.loadUsers();
    this.loadClient();
  }

  getListVente() {
    this.isloadingtable = true;
    const vente: GetVente = { vente_id: 0 };
    this.venteService.getList(vente).subscribe((data) => {
      this.ventes = data.message;
      console.log(data.message);
      this.TotalMontant = this.globalService.calculTotal(
        'montant_total',
        data.message
      );
      this.TotalMontantBenefice = this.globalService.calculTotal(
        'total_benefice_vente',
        data.message
      );
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.calculerTotauxBenefices();
      this.calculerTotauxBeneficeMois()
      this.calculerTotauxBeneficesAnnuelle()
      this.afficherGraphique();
      this.isloadingtable = false;
    });
  }

  calculerTotauxBenefices() {
    const aujourdhui = new Date();
    const hier = new Date();
    hier.setDate(aujourdhui.getDate() - 1);

    // Calcul des bénéfices du jour actuel
    this.totalBeneficesJourActuel = this.ventes
      .filter(
        (vente) =>
          new Date(vente.date_vente).toDateString() ===
          aujourdhui.toDateString()
      )
      .reduce((total, vente) => total + Number(vente.total_benefice_vente), 0);

    // Calcul des bénéfices du jour précédent
    this.totalBeneficesJourPrecedent = this.ventes
      .filter(
        (vente) =>
          new Date(vente.date_vente).toDateString() === hier.toDateString()
      )
      .reduce((total, vente) => total + Number(vente.total_benefice_vente), 0);
  }

  calculerTotauxBeneficeMois() {
    const aujourdhui = new Date();
    const premierJourMoisActuel = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1);
    const dernierJourMoisActuel = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth() + 1, 0);

    const moisPrecedent = aujourdhui.getMonth() === 0 ? 11 : aujourdhui.getMonth() - 1;
    const anneePrecedente = aujourdhui.getMonth() === 0 ? aujourdhui.getFullYear() - 1 : aujourdhui.getFullYear();
    const premierJourMoisPrecedent = new Date(anneePrecedente, moisPrecedent, 1);
    const dernierJourMoisPrecedent = new Date(anneePrecedente, moisPrecedent + 1, 0);

    // Calcul des bénéfices du mois actuel
    this.totalBeneficesMoisActuel = this.ventes
      .filter((vente) => {
        const dateVente = new Date(vente.date_vente);
        return dateVente >= premierJourMoisActuel && dateVente <= dernierJourMoisActuel;
      })
      .reduce((total, vente) => total + Number(vente.total_benefice_vente), 0);

    // Calcul des bénéfices du mois précédent
    this.totalBeneficesMoisPrecedent = this.ventes
      .filter((vente) => {
        const dateVente = new Date(vente.date_vente);
        return dateVente >= premierJourMoisPrecedent && dateVente <= dernierJourMoisPrecedent;
      })
      .reduce((total, vente) => total + Number(vente.total_benefice_vente), 0);
}

calculerTotauxBeneficesAnnuelle() {
  const aujourdhui = new Date();
  const anneeActuelle = aujourdhui.getFullYear();
  
  // Déterminer les premières et dernières dates de l'année actuelle
  const premierJourAnneeActuelle = new Date(anneeActuelle, 0, 1);
  const dernierJourAnneeActuelle = new Date(anneeActuelle + 1, 0, 0);
  
  // Déterminer les premières et dernières dates de l'année précédente
  const anneePrecedente = anneeActuelle - 1;
  const premierJourAnneePrecedente = new Date(anneePrecedente, 0, 1);
  const dernierJourAnneePrecedente = new Date(anneePrecedente + 1, 0, 0);

  // Calcul des bénéfices de l'année actuelle
  this.totalBeneficesAnneeActuelle = this.ventes
    .filter((vente) => {
      const dateVente = new Date(vente.date_vente);
      return dateVente >= premierJourAnneeActuelle && dateVente <= dernierJourAnneeActuelle;
    })
    .reduce((total, vente) => total + Number(vente.total_benefice_vente), 0);

  // Calcul des bénéfices de l'année précédente
  this.totalBeneficesAnneePrecedent = this.ventes
    .filter((vente) => {
      const dateVente = new Date(vente.date_vente);
      return dateVente >= premierJourAnneePrecedente && dateVente <= dernierJourAnneePrecedente;
    })
    .reduce((total, vente) => total + Number(vente.total_benefice_vente), 0);
}



  loadClient() {
    const client: GetClient = { client_id: 0 };
    this.clientService.getListClient(client).subscribe((data) => {
      console.log(data);
      this.tbClients = data.message;
    });
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
    });
  }

  getPointName(point_de_vente_id: number): string {
    const point = this.tbPointdeVente.find(
      (p) => p.point_de_vente_id === point_de_vente_id
    );
    return point ? point.nom : 'Unknown Point';
  }

  loadUsers() {
    const user: GetUser = { utilisateur_id: 0 };
    this.userService.getListUser(user).subscribe((data) => {
      console.log(data);
      this.tbUsers = data.message;
    });
  }

  getClientName(client_id: number): string {
    const client = this.tbClients.find((c) => c.client_id === client_id);
    return client ? client.nom : 'Unknown Client';
  }

  getUserName(utilisateur_id: number): string {
    const user = this.tbUsers.find((u) => u.utilisateur_id === utilisateur_id);
    return user
      ? user.nom_utilisateur + ' ' + user.prenom_utilisateur
      : 'Unknown User';
  }

  afficherGraphique() {
    console.log(this.ventes);
    // Vérifiez que les ventes existent
    if (!this.ventes || this.ventes.length === 0) {
      console.error('Aucune donnée disponible pour afficher le graphique.');
      return;
    }
    const montantsParMois = Array(12).fill(0);
    this.ventes.forEach((vente) => {
      const dateVente = new Date(vente.date_vente);
      if (dateVente.getFullYear() === new Date().getFullYear()) {
        const moisIndex = dateVente.getMonth();
        // Vérifier si total_benefice_vente est null ou non défini
        const totalBeneficeVente = vente.total_benefice_vente
          ? Number(vente.total_benefice_vente)
          : 0;
        montantsParMois[moisIndex] += totalBeneficeVente;
      }
    });

    const montantsParMoisFormatted = montantsParMois.map(
      (montant) => `${montant.toFixed(2)} FCFA`
    );

    const chart = new ApexCharts(
      document.querySelector('#payment-records-chart2'),
      {
        chart: {
          height: 200,
          width: '100%',
          stacked: false,
          toolbar: { show: false },
        },
        stroke: { width: [1], curve: 'smooth', lineCap: 'round' },
        plotOptions: { bar: { endingShape: 'rounded', columnWidth: '10%' } },
        colors: ['#3454d1'],
        series: [
          {
            name: 'Bénéfices Totaux',
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
          categories: this.moisNoms.map((mois) => mois + '/24'),
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

  SelectPointDeVente(event: any) {
    console.log(event.target.value);
    this.venteService
      .getVenteByPointDeVente(Number(event.target.value))
      .subscribe((data) => {
        console.log(data.message);
        this.ventes = data.message;
        this.TotalMontant = this.globalService.calculTotal('montant_total',data.message);
        this.TotalMontantBenefice = this.globalService.calculTotal('total_benefice_vente',data.message);
        this.dataSource = new MatTableDataSource(data.message);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
}
