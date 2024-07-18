import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Vente,GetVente } from 'src/app/Models/vente.model';
import { VenteService } from 'src/app/Services/vente.service';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { ClientsService } from 'src/app/Services/clients.service';
import { UsersService } from 'src/app/Services/users.service';
import { SelectPointDeVenteComponent } from 'src/app/settings/points-de-ventes/select-point-de-vente/select-point-de-vente.component';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import ApexCharts from 'apexcharts'

@Component({
  selector: 'app-vente',
  templateUrl: './vente.component.html',
  styleUrls: ['./vente.component.scss']
})
export class VenteComponent {
  dataSource!: any;
  displayedColumns = [
    'date_vente',
    'montant_total',
    'client_id',
    'utilisateur_id',
    'point_de_vente_id',
    'Actions'
  ];

  isloadingpage!: boolean
  selectedVenteString: string = ''
  tbUsers: Utilisateur[] = []
  tbClients: Client[] = [];
  ventes!: Vente[]
  TotalMontant!: number
  pointSelected!:PointsDeVentes;
  tbPointdeVente!: PointsDeVentes[]

  IDuser!: number 
  IDclient!: number 
  IDpoint!: number 
  DateDebut!: string 
  DateFin!: string

  constructor(
    private venteService: VenteService,
    private router: Router,
    private pointService: PointsDeVentesService,
    private clientService: ClientsService,
    private userService: UsersService,
    public globalService: GlobalService,
    private dialog: MatDialog
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListProduit()
    this.loadClient()
    this.loadUsers()
    this.loadPointDeVente()

    this.renderChart();
    this.renderChart2()
    this.renderChart3()
    this.renderChart4()
  }

  loadClient(){
    const client : GetClient = {client_id: 0}
    this.clientService.getListClient(client).subscribe(data => {
      console.log(data);
      this.tbClients = data.message
    })
  }


  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
      
    } )
  }

  getPointName(point_de_vente_id: number): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
  }

  loadUsers(){
    const user : GetUser = {utilisateur_id: 0}
    this.userService.getListUser(user).subscribe(data => {
      console.log(data);
      this.tbUsers = data.message
    })
  }

  getClientName(client_id: number): string {
    const client = this.tbClients.find(c => c.client_id === client_id);
    return client ? client.nom : 'Unknown Client';
  }
  
  getUserName(utilisateur_id: number): string {
    const user = this.tbUsers.find(u => u.utilisateur_id === utilisateur_id);
    return user ? user.nom_utilisateur + ' ' + user.prenom_utilisateur : 'Unknown User';
  }
  
  getListProduit(){
    const vente : GetVente = {vente_id: 0}
    this.isloadingpage = true
    this.venteService.getList(vente).subscribe(data => {
      console.log(data.message);
      this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
      console.log(this.TotalMontant);
      this.isloadingpage = false
      this.ventes = data.message
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
     });
  }

  imprimer() {
    console.log('gggg');
    this.venteService.getListVenteEtatPDF(this.ventes).subscribe((data) => {
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

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  actions(element: Vente){
    this.selectedVenteString = JSON.stringify(element); 
    localStorage.setItem('selectedVente', this.selectedVenteString);
    if (this.selectedVenteString) {
      this.router.navigateByUrl('vente/view')
    }
  }



  openPointsDeVentes() {
    const dialog = this.dialog.open(SelectPointDeVenteComponent);
    dialog.afterClosed().subscribe((result) => {
      this.pointSelected = dialog.componentInstance.pointSelected;
      console.log(this.pointSelected);
      localStorage.setItem('pointSelected', JSON.stringify(this.pointSelected));
      // window.location.reload()
      this.router.navigateByUrl('/session-vente');
    });
  }

  selectUser(event: any){
    this.IDuser = Number(event.target.value)
    console.log(this.IDuser); 
    this.venteService.getListVenteByParametre(this.IDclient, this.IDuser,this.IDpoint, this.DateDebut,this.DateFin).subscribe(data => {
      console.log(data.message);
      this.ventes = data.message
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }

  selectClient(event: any){
    this.IDclient = Number(event.target.value)
    this.venteService.getListVenteByParametre(this.IDclient, this.IDuser,this.IDpoint, this.DateDebut,this.DateFin).subscribe(data => {
      console.log(data.message);
      this.ventes = data.message
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }


  selectPointDeVente(event: any){
    console.log(event.target.value);
    this.IDpoint = Number(event.target.value)
    this.venteService.getListVenteByParametre(this.IDclient, this.IDuser,this.IDpoint, this.DateDebut,this.DateFin).subscribe(data => {
      console.log(data.message);
      this.ventes = data.message
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }

  selectDateDebut(event: any){
    this.DateDebut = event.target.value
    console.log(this.DateDebut)
    this.venteService.getListVenteByParametre(this.IDclient, this.IDuser,this.IDpoint, this.DateDebut,this.DateFin).subscribe(data => {
      console.log(data.message);
      this.ventes = data.message
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort; 
      this.dataSource.paginator = this.paginator;
    } )
  }

  selectDateFin(event: any){
    this.DateFin = event.target.value
    this.venteService.getListVenteByParametre(this.IDclient, this.IDuser,this.IDpoint, this.DateDebut,this.DateFin).subscribe(data => {
      console.log(data.message);
      this.ventes = data.message
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }

  renderChart() {
    const options = {
      series: [{
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Product Trends by Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      }
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  }

  renderChart2() {
    const options = {
      series: [
        {
          name: "Actual",
          data: [
            { x: "2011", y: 1292 },
            { x: "2012", y: 4432 },
            { x: "2013", y: 5423 },
            { x: "2014", y: 6653 },
            { x: "2015", y: 8133 },
            { x: "2016", y: 7132 },
            { x: "2017", y: 7332 },
            { x: "2018", y: 6553 }
          ]
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          columnWidth: "60%"
        }
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        markers: {
          fillColors: ["#00E396", "#775DD0"]
        }
      },
      xaxis: {
        categories: [
          "2011", "2012", "2013", "2014",
          "2015", "2016", "2017", "2018"
        ]
      }
    };

    const chart = new ApexCharts(document.querySelector("#chart2"), options);
    chart.render();
  }

  renderChart3() {
    const options = {
      series: [
        { name: "PRODUCT A", data: [44, 55, 41, 67, 22, 43] },
        { name: "PRODUCT B", data: [13, 23, 20, 8, 13, 27] },
        { name: "PRODUCT C", data: [11, 17, 15, 15, 21, 14] },
        { name: "PRODUCT D", data: [21, 7, 25, 13, 22, 8] }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: [
          "01/2011",
          "02/2011",
          "03/2011",
          "04/2011",
          "05/2011",
          "06/2011"
        ]
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    };

    const chart = new ApexCharts(document.querySelector("#chart3"), options);
    chart.render();
  }


  renderChart4() {
    const options = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    const chart = new ApexCharts(document.querySelector("#chart4"), options);
    chart.render();
  }
}
