import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilisateur } from 'src/app/Models/users.model';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/Services/users.service';
import { GlobalService } from 'src/app/Services/global.service';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { ClientsService } from 'src/app/Services/clients.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { Produit } from 'src/app/Models/produit.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fiche-client',
  templateUrl: './fiche-client.component.html',
  styleUrls: ['./fiche-client.component.scss']
})
export class FicheClientComponent {

  dataSource!: any
  displayedColumns = [
    'produit_nom',
    'quantite',
    'prix_unitaire',
    'prix_total_vente',
    'point_de_vente_id'
  ];

  @Input() action!:string;
  client!: Client;
  message!: any
  tbPointdeVente!: PointsDeVentes[]
  tbProduit!: any[]
  sort: any;
  paginator: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private pointService: PointsDeVentesService,
    private clientService: ClientsService
  ){}

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action']
    console.log(this.action);
    const clientJSON = localStorage.getItem('selectedClient');
    if (clientJSON) {
      this.client =  JSON.parse(clientJSON);
      console.log(this.client);
    }
    this.getProduitsAchetesByClient()
    this.loadPointDeVente()
  }

  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
      console.log(this.tbPointdeVente);
      
    } )
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
  }
  
  updateClient(){
    this.router.navigateByUrl('/client/edit')
  }
  //delete user for BD
  deleteClient(){
    const alert = this.dialog.open(AlertComponent)
    alert.componentInstance.content = "Voulez-vous supprimé le client " + this.client.nom + ' ?'
    alert.componentInstance.backgroundColor = "danger"
    alert.afterClosed().subscribe(confirmDelete => {
      if (confirmDelete) {
        console.log(this.client);
        this.clientService.deleteClient(this.client).subscribe(data => {
          console.log(data.message);
          this.message = data.message
          this.router.navigateByUrl('/client/list')
          this.globalService.toastShow(this.message,'Succès','success')
        } )
      }
      
    })
  }

  getProduitsAchetesByClient(){
    const client: GetClient = {
      client_id: this.client.client_id
    }
    console.log(client);
    this.clientService.getListProduitAchetesByClient(client).subscribe(data => {
      console.log(data.message);
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.tbProduit);
    })
  }

  imprimer() {
    this.clientService.getHistoriqueAchetesByClient(this.tbProduit).subscribe((data) => {
        console.log(data);
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'historique_article_achetes_client.pdf';
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
