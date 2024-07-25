import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { CommandeService } from 'src/app/Services/commande.service';
import { CommandeAchat, GetCommandeAchat } from 'src/app/Models/commande.model';
import { Fournisseur, GetFournisseur } from 'src/app/Models/fournisseur.model';
import { FournisseurService } from 'src/app/Services/fournisseur.service';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { UsersService } from 'src/app/Services/users.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { SelectPointDeVenteComponent } from 'src/app/settings/points-de-ventes/select-point-de-vente/select-point-de-vente.component';

@Component({
  selector: 'app-commande-achat',
  templateUrl: './commande-achat.component.html',
  styleUrls: ['./commande-achat.component.scss']
})
export class CommandeAChatComponent {
  dataSource!: any;
  displayedColumns = [
    'date_commande',
    'fournisseur_id',
    'montant_total',
    'utilisateur_id',
    'point_de_vente_id',
    'statut',
    'Actions'
  ];

  isloadingpage!: boolean
  selectedcommandeString!: string;
  tbfournisseur!: Fournisseur[]
  tbUsers: Utilisateur[] = []
  TotalMontant!: number
  tbPointdeVente!: PointsDeVentes[]
  commandesachats!: CommandeAchat[]

  IDfournisseur!: number
  IDuser!: number
  IDpointVente!: number
  DateDebut!: string
  DateFin!: string

  pointSelected!: PointsDeVentes

  constructor(
    private commandeService: CommandeService,
    private router: Router,
    private pointService: PointsDeVentesService,
    private fournisseurService: FournisseurService,
    public globalService: GlobalService,
    private userService: UsersService,
    private dialog: MatDialog
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListCommandes()
    this.loadFournisseur()
    this.loadUsers()
    this.loadPointDeVente()
  }

  loadUsers(){
    const user : GetUser = {utilisateur_id: 0}
    this.userService.getListUser(user).subscribe(data => {
      console.log(data);
      this.tbUsers = data.message
    })
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

  loadFournisseur(){
    const fournisseur : GetFournisseur = {fournisseur_id: 0}
    this.fournisseurService.getList(fournisseur).subscribe(data => {
      console.log(data.message);
      this.tbfournisseur = data.message
    })
  }
  
  getFounisseurName(fournisseur_id: number): string {
    const fournisseur = this.tbfournisseur.find(f => f.fournisseur_id === fournisseur_id);
    return fournisseur ? (fournisseur.nom): '';
  }

  getUserName(utilisateur_id: number): string {
    const user = this.tbUsers.find(u => u.utilisateur_id === utilisateur_id);
    return user ? user.nom_utilisateur + ' ' + user.prenom_utilisateur : 'Unknown User';
  }

  getListCommandes(){
    const commande : GetCommandeAchat = {commande_achat_id: 0}
    this.isloadingpage = true
    this.commandeService.getList(commande).subscribe(data => {
      console.log(data.message);
      this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);      
      this.isloadingpage = false
      this.commandesachats = data.message
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
     });
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  actions(element: CommandeAchat){
    this.selectedcommandeString = JSON.stringify(element); 
    localStorage.setItem('selectedCommande', this.selectedcommandeString);
    if (this.selectedcommandeString) {
      this.router.navigateByUrl('commande/achat/view')
    }
  }

  openPointsDeVentesCommande(){
    const storedPointSelected = localStorage.getItem('pointSelectedCommande');
    if (storedPointSelected) {
      localStorage.removeItem('pointSelectedCommande');
      console.log('PointSelected exists and has been removed.');
    } else {
      console.log('PointSelected does not exist.');
    }
    const dialog = this.dialog.open(SelectPointDeVenteComponent);
    dialog.afterClosed().subscribe((result) => {
      this.pointSelected = dialog.componentInstance.pointSelected;
      console.log(this.pointSelected);
      localStorage.setItem('pointSelectedCommande', JSON.stringify(this.pointSelected));
      this.router.navigateByUrl('/session-commande-achat');
    }); 
  }

  SelectPointDeVente(event: any){
    console.log(event.target.value);
    this.IDpointVente = Number(event.target.value)
    this.commandeService.getListFiltreCommandes(this.IDfournisseur, this.IDuser, this.IDpointVente, this.DateDebut, this.DateFin).subscribe(data => {
      console.log(data.message);
      this.commandesachats = data.message
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
         this.TotalMontant = 0
        this.globalService.toastShow('Aucune commande effectuée','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(data.message);
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }

  selectFournisseur(event: any){
    console.log(event.target.value);
    this.IDfournisseur = Number(event.target.value)
    this.commandeService.getListFiltreCommandes(this.IDfournisseur, this.IDuser, this.IDpointVente, this.DateDebut, this.DateFin).subscribe(data => {
      console.log(data.message);
      this.commandesachats = data.message
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
         this.TotalMontant = 0
        this.globalService.toastShow('Aucune commande effectuée','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(data.message);
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }

  selectUser(event: any){
    console.log(event.target.value);
    this.IDuser = Number(event.target.value)
    this.commandeService.getListFiltreCommandes(this.IDfournisseur, this.IDuser, this.IDpointVente, this.DateDebut, this.DateFin).subscribe(data => {
      console.log(data.message);
      this.commandesachats = data.message
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
         this.TotalMontant = 0
        this.globalService.toastShow('Aucune commande effectuée','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(data.message);
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }

  SelectDateDebut(event: any){
    console.log(event.target.value);
    this.DateDebut = event.target.value
    this.commandeService.getListFiltreCommandes(this.IDfournisseur, this.IDuser, this.IDpointVente, this.DateDebut, this.DateFin).subscribe(data => {
      console.log(data.message);
      this.commandesachats = data.message
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
         this.TotalMontant = 0
        this.globalService.toastShow('Aucune commande effectuée','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(data.message);
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }

  SelectDateFin(event: any){
    console.log(event.target.value);
    this.DateFin = event.target.value
    this.commandeService.getListFiltreCommandes(this.IDfournisseur, this.IDuser, this.IDpointVente, this.DateDebut, this.DateFin).subscribe(data => {
      console.log(data.message);
      this.commandesachats = data.message
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
         this.TotalMontant = 0
        this.globalService.toastShow('Aucune commande effectuée','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(data.message);
        this.TotalMontant = this.globalService.calculTotal('montant_total', data.message);
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } )
  }

  imprimer() {
    this.commandeService.getListCommandesPDF(this.commandesachats).subscribe((data) => {
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
