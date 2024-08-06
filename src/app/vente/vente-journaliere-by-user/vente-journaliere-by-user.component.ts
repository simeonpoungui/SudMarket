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
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Services/produit.service';

@Component({
  selector: 'app-vente-journaliere-by-user',
  templateUrl: './vente-journaliere-by-user.component.html',
  styleUrls: ['./vente-journaliere-by-user.component.scss']
})
export class VenteJournaliereByUserComponent {
  dataSource!: any;
  displayedColumns = [
    'produit_id',
    'quantite',
    'prix_unitaire',
    'prix_total_vente',
    'date_article_vendu',
    'remise'
  ];

  client!: Client;
  message!: any
  tbPointdeVente!: PointsDeVentes[]
  tbProduit!: any[]
  date_comptable!: string
  user!: Utilisateur;
  TotalMontant!: number
  ListProduit!: Produit[]


  constructor(
    private venteService: VenteService,
    private router: Router,
    private produitService: ProduitService,
    private pointService: PointsDeVentesService,
    private clientService: ClientsService,
    private userService: UsersService,
    public globalService: GlobalService,
    private dialog: MatDialog
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user =  JSON.parse(utilisateurJson);
    }

    this.getCurrentDateFormatted()
    this.getListVenteJournaliere()
    this.loadPointDeVente()
    this.loadProduit()
  }

  getCurrentDateFormatted() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    this.date_comptable = `${year}-${month}-${day}`;
    console.log(this.date_comptable);
  }

  getListVenteJournaliere(){
    this.venteService.getVenteJournaliereByUser(this.user.utilisateur_id, this.date_comptable).subscribe(data => {
      console.log(data.message);
      this.TotalMontant = this.globalService.calculTotal('prix_total_vente', data.message);
      console.log(this.TotalMontant);
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.tbProduit = data.message
    })
  }

  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
      console.log(this.tbPointdeVente);
      
    } )
  }

  loadProduit(){
    const p: GetProduit = {produit_id:0}
    this.produitService.getList(p).subscribe(data => {
      console.log(data.message);
      this.ListProduit = data.message
      console.log(this.ListProduit);
      
    } )
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
  }

  getProduitName(produit_id: any): string {
    const p = this.ListProduit.find(p => p.produit_id === produit_id);
    return p ? p.nom : 'Unknown Produit';
  }

    // getArticleVenteJournaliere(){
  //   this.venteService.getArticleVenteJournaliereByUser(this.date_comptable).subscribe(data => {
  //     console.log(data.message);
  //     console.log(this.tbProduit);
      

  //   } )
  // }
  
}
