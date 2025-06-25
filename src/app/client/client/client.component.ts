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

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent {

  dataSource!: any;
  displayedColumns = [
    'nom',
    'prenom',
    'email',
    'telephone',
    'sexe',
    'adresse',
    'nationalite'
    ];

  isloadingpage!: boolean
  selectedClientstring: string = ''
  tbPointdeVente!: PointsDeVentes[]

  nbHommes: number = 0;
  nbFemmes: number = 0;
  nbclients: number = 0

  constructor(
    private router: Router,
    private clientService: ClientsService,
    private globalService: GlobalService,
    private pointService: PointsDeVentesService,
    private dialog: MatDialog
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListClient()
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
  
getListClient() {
  const client: GetClient = { client_id: 0 };
  this.isloadingpage = true;
  this.clientService.getListClient(client).subscribe(data => {
    console.log(data.message);
    this.nbclients = data.message.length;
    
    // Compter le nombre d'hommes et de femmes
    const countByGender = data.message.reduce((acc, client) => {
      if (client.sexe === 'Homme') {
        acc.hommes++;
      } else if (client.sexe === 'Femme') {
        acc.femmes++;
      }
      return acc;
    }, { hommes: 0, femmes: 0 });

    // Stocker les résultats dans des variables de classe
    this.nbHommes = countByGender.hommes;
    this.nbFemmes = countByGender.femmes;

    this.isloadingpage = false;
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

SelectPointDeVente(event: any) {
  console.log(event.target.value);
  this.clientService.getFiltreClientByPointDeVente(Number(event.target.value)).subscribe(data => {
    console.log(data.message);
    
    if (typeof data.message === 'string') {
      this.dataSource = new MatTableDataSource([]);
      this.nbclients = 0;
      this.nbHommes = 0;
      this.nbFemmes = 0;
      this.globalService.toastShow('Aucun client trouvé', 'Information', 'info');
    } else {
      this.dataSource = new MatTableDataSource(data.message);
      this.nbclients = data.message.length;
      
      // Compter le nombre d'hommes et de femmes
      const countByGender = data.message.reduce((acc: { hommes: number; femmes: number; }, client: { sexe: string; }) => {
        if (client.sexe === 'Homme') {
          acc.hommes++;
        } else if (client.sexe === 'Femme') {
          acc.femmes++;
        }
        return acc;
      }, { hommes: 0, femmes: 0 });

      // Mettre à jour les variables
      this.nbHommes = countByGender.hommes;
      this.nbFemmes = countByGender.femmes;
    }
    
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  });
}

  imprimer() {
    this.clientService.getListClientPDF().subscribe((data) => {
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

}
