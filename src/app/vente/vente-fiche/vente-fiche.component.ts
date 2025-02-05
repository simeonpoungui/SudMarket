import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { GetVente, Vente } from 'src/app/Models/vente.model';
import { VenteService } from 'src/app/Services/vente.service';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { ClientsService } from 'src/app/Services/clients.service';
import { UsersService } from 'src/app/Services/users.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { ArticlesDeVentes, GetArticleDeVente } from 'src/app/Models/articlesDeVente.model';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Services/produit.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-vente-fiche',
  templateUrl: './vente-fiche.component.html',
  styleUrls: ['./vente-fiche.component.scss']
})
export class VenteFicheComponent {
  dataSource!: any
  displayedColumns = [
    'produit_id',
    'quantite',
    'prix_unitaire',
    'prix_total_vente',
    'point_de_vente_id'
  ];

  action:string = 'view';
  vente!: Vente;
  message!: any
  
  tbUsers: Utilisateur[] = []
  tbProduit: Produit[] = []
  tbClients: Client[] = [];
  tbPointdeVente: PointsDeVentes[] = []
  tbarticlesDeVente: any[] = []
  sort: any;
  paginator: any;

  constructor(
    private route: ActivatedRoute,
    private produitService: ProduitService,
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private userService: UsersService,
    private clientService: ClientsService,
    private pointService: PointsDeVentesService,
    private venteService: VenteService
  ){}

  ngOnInit(): void {
    console.log(this.action);
    const venteJson = localStorage.getItem('selectedVente');
    if (venteJson) {
      this.vente =  JSON.parse(venteJson);
    }
    this.loadClient()
    this.loadUsers()
    this.loadPointDeVente()
    this.loadProduit()
    this.getArticlesDeVenteByVenteID()
  }

  getArticlesDeVenteByVenteID(){
    const venteID: GetVente = {
      vente_id: this.vente.vente_id
    }
    this.venteService.getArticleDeVenteByVente(venteID).subscribe(data => {
      console.log(data.message);
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      if (typeof data.message === 'string') {
        this.globalService.toastShow('Aucun article vendu','Information','info')
      }
    } )
  }

  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
      
    } )
  }

  loadProduit(){
    const produit : GetProduit = {produit_id: 0}
    this.produitService.getList(produit).subscribe(data => {
      console.log(data.message);
      this.tbProduit = data.message
    })
  }

  getProduitName(produit_id: number): string {
    const produit = this.tbProduit.find(p => p.produit_id === produit_id);
    return produit ? (produit.nom ): '';
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
  }
  
  loadClient(){
    const client : GetClient = {client_id: 0}
    this.clientService.getListClient(client).subscribe(data => {
      console.log(data);
      this.tbClients = data.message
    })
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
  
  deletevente(){
    const alert = this.dialog.open(AlertComponent)
    alert.componentInstance.content = "Voulez-vous supprimé la vente numéro " + this.vente.vente_id + ' ?'
    alert.componentInstance.backgroundColor = "danger"
    alert.afterClosed().subscribe(confirmDelete => {
      if (confirmDelete) {
        console.log(this.vente);
        this.venteService.delete(this.vente).subscribe(data => {
          console.log(data.message);
          this.message = data.message
          this.router.navigateByUrl('/vente/list')
          this.globalService.toastShow(this.message,'Succès','success')
        } )
      }
    })
  }
}
