import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { ClientsService } from 'src/app/Services/clients.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { CommandeService } from 'src/app/Services/commande.service';
import { GetPaiement } from 'src/app/Models/paiement.commande.model';

@Component({
  selector: 'app-paiement-commande-list',
  templateUrl: './paiement-commande-list.component.html',
  styleUrls: ['./paiement-commande-list.component.scss']
})
export class PaiementCommandeListComponent {

  dataSource!: any;
  displayedColumns = [
    'commande_achat_id',
    'montant',
    'date_paiement',
    'mode_paiement',
  ];


  isloadingpage!: boolean
  selectedClientstring: string = ''
  tbPointdeVente!: PointsDeVentes[]
  nbclients: number = 0

  constructor(
    private router: Router,
    private clientService: ClientsService,
    public globalService: GlobalService,
    private commandeService: CommandeService,
    private pointService: PointsDeVentesService,
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListPaiement()
    this.loadPointDeVente()
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
  
  getListPaiement(){
    const paiement : GetPaiement = {paiement_id: 0}
    this.isloadingpage = true
    this.commandeService.getListPaiement(paiement).subscribe(data => {
      console.log(data.message);
      this.nbclients = data.message.length
      this.isloadingpage = false
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
     });
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  create(){
    this.router.navigateByUrl('client/create')
  }

  actions(element: Client){
    console.log(element);
    this.selectedClientstring = JSON.stringify(element); 
    localStorage.setItem('selectedClient', this.selectedClientstring);
    if (this.selectedClientstring) {
      this.router.navigateByUrl('fiche/client/view')
    }
  }


}
