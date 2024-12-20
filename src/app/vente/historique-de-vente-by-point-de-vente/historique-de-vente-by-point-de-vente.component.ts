import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-historique-de-vente-by-point-de-vente',
  templateUrl: './historique-de-vente-by-point-de-vente.component.html',
  styleUrls: ['./historique-de-vente-by-point-de-vente.component.scss']
})
export class HistoriqueDeVenteByPointDeVenteComponent {
  dataSource!: any;
  displayedColumns = [
    'date_vente',
    'montant_total',
    'client_id',
    'utilisateur_id',
    'point_de_vente_id',
    'total_benefice_vente',
    'Actions'
  ];
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

  isloadingpage!: boolean
  selectedVenteString: string = ''
  tbUsers: Utilisateur[] = []
  tbClients: Client[] = [];
  ventes!: Vente[]
  TotalMontant!: number
  TotalMontantBenefice!: number
  pointSelected!:PointsDeVentes;
  tbPointdeVente!: PointsDeVentes[]

  IDuser!: number 
  IDclient!: number 
  IDpoint!: number 
  DateDebut!: string 
  DateFin!: string
  point_de_vente_id!: number

  constructor(
    private venteService: VenteService,
    private router: Router,
    private route : ActivatedRoute,
    private pointService: PointsDeVentesService,
    private clientService: ClientsService,
    private userService: UsersService,
    public globalService: GlobalService,
    private dialog: MatDialog
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    const point_de_vente_id = this.route.snapshot.params['id']
    this.point_de_vente_id = point_de_vente_id

    this.getListVente()
    this.loadClient()
    this.loadUsers()
    this.loadPointDeVente()

    // this.renderChart();
    // this.renderChart2()
    // this.renderChart3()
    // this.renderChart4()
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
  
  getListVente(){
    this.isloadingpage = true
    this.venteService.getVenteByPointDeVente(this.point_de_vente_id).subscribe(data => {
      console.log(data.message);
      this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
      this.TotalMontantBenefice = this.globalService.calculTotal('total_benefice_vente', data.message);
      console.log(this.TotalMontant);
      this.isloadingpage = false
      this.ventes = data.message
      // this.afficherGraphique()
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
      this.router.navigateByUrl('/session-vente');
    });
  }

  selectUser(event: any){
    this.IDuser = Number(event.target.value)
    console.log(this.IDuser); 
    this.venteService.getListVenteByParametre(this.IDclient, this.IDuser,this.IDpoint, this.DateDebut,this.DateFin).subscribe(data => {
      console.log(data.message);
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
        this.globalService.toastShow('Aucune vente effectuée','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(data.message);
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }

  selectClient(event: any){
    this.IDclient = Number(event.target.value)
    this.venteService.getListVenteByParametre(this.IDclient, this.IDuser,this.IDpoint, this.DateDebut,this.DateFin).subscribe(data => {
      console.log(data.message);
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
        this.globalService.toastShow('Aucune vente effectuée','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(data.message);
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }


  selectPointDeVente(event: any){
    console.log(event.target.value);
    this.IDpoint = Number(event.target.value)
    this.venteService.getListVenteByParametre(this.IDclient, this.IDuser,this.IDpoint, this.DateDebut,this.DateFin).subscribe(data => {
      console.log(data.message);
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
        this.globalService.toastShow('Aucune vente effectuée','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(data.message);
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }

  selectDateDebut(event: any){
    this.DateDebut = event.target.value
    console.log(this.DateDebut)
    this.venteService.getListVenteByParametre(this.IDclient, this.IDuser,this.IDpoint, this.DateDebut,this.DateFin).subscribe(data => {
      console.log(data.message);
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
        this.globalService.toastShow('Aucune vente effectuée','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(data.message);
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }

  selectDateFin(event: any){
    this.DateFin = event.target.value
    this.venteService.getListVenteByParametre(this.IDclient, this.IDuser,this.IDpoint, this.DateDebut,this.DateFin).subscribe(data => {
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
        this.globalService.toastShow('Aucune vente effectuée','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(data.message);
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }



}
