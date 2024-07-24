import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { ClientsService } from 'src/app/Services/clients.service';
import { UsersService } from 'src/app/Services/users.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { CommandeService } from 'src/app/Services/commande.service';
import { CommandeAchat } from 'src/app/Models/commande.model';
import { Fournisseur, GetFournisseur } from 'src/app/Models/fournisseur.model';
import { FournisseurService } from 'src/app/Services/fournisseur.service';

@Component({
  selector: 'app-commande-achat-form',
  templateUrl: './commande-achat-form.component.html',
  styleUrls: ['./commande-achat-form.component.scss']
})
export class CommandeAChatFormComponent {
  action:string = 'edit';
  commandes!: CommandeAchat;
  message!: any
  
  commande_achat_id!: number;
  point_de_vente_id?: number; 
  fournisseur_id!: number;
  date_commande?: string;
  montant_total!: number;
  statut?: string;
  utilisateur_id!: number;

  tbUsers: Utilisateur[] = []
  tbClients: Client[] = [];
  tbFournisseurs!: Fournisseur[]
  tbPointdeVente!: PointsDeVentes[]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private userService: UsersService,
    private fournisseurService: FournisseurService,
    private clientService: ClientsService,
    private pointService: PointsDeVentesService,
    private commandeService: CommandeService
  ){}

  ngOnInit(): void {
    console.log(this.action);
    const commandeJSON = localStorage.getItem('selectedCommande');
    if (commandeJSON) {
      this.commandes =  JSON.parse(commandeJSON);
      console.log(this.commandes);
      
    }
    this.loadClient()
    this.loadUsers()
    this.loadPointDeVente()
    this.loadFournisseur()
    this.initFormCommande()
  }

  initFormCommande(){
    this.commande_achat_id = this.commandes.commande_achat_id
    this.point_de_vente_id =  this.commandes.point_de_vente_id
    this.fournisseur_id = this.commandes.fournisseur_id
    this.date_commande = this.commandes.date_commande
    this.montant_total = this.commandes.montant_total
    this.statut = this.commandes.statut
    this.utilisateur_id =  this.commandes.utilisateur_id
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
  
  loadClient(){
    const client : GetClient = {client_id: 0}
    this.clientService.getListClient(client).subscribe(data => {
      console.log(data);
      this.tbClients = data.message
    })
  }

  loadFournisseur(){
    const fournisseur : GetFournisseur = {fournisseur_id: 0}
    this.fournisseurService.getList(fournisseur).subscribe(data => {
      console.log(data);
      this.tbFournisseurs = data.message
    })
  }

  loadUsers(){
    const user : GetUser = {utilisateur_id: 0}
    this.userService.getListUser(user).subscribe(data => {
      console.log(data);
      this.tbUsers = data.message
    })
  }

  getFournisseurName(fournisseur_id: number): string {
    const fournisseur = this.tbFournisseurs.find(f => f.fournisseur_id === fournisseur_id);
    return fournisseur ? fournisseur.nom : 'Unknown Fournisseur';
  }

  getClientName(client_id: number): string {
    const client = this.tbClients.find(c => c.client_id === client_id);
    return client ? client.nom : 'Unknown Client';
  }
  
  getUserName(utilisateur_id: number): string {
    const user = this.tbUsers.find(u => u.utilisateur_id === utilisateur_id);
    return user ? user.nom_utilisateur + ' ' + user.prenom_utilisateur : 'Unknown User';
  }

  updateCommande(){
    this.router.navigateByUrl('commande/achat/edit')
  }
  
  deleteCommande(){
    const alert = this.dialog.open(AlertComponent)
    alert.componentInstance.content = "Voulez-vous supprimé la commande " + this.commandes.commande_achat_id + ' ?'
    alert.componentInstance.backgroundColor = "danger"
    alert.afterClosed().subscribe(confirmDelete => {
      if (confirmDelete) {
        console.log(this.commandes);
        this.commandeService.delete(this.commandes ).subscribe(data => {
          console.log(data.message);
          this.message = data.message
          this.router.navigateByUrl('commande/achat/list')
          this.globalService.toastShow(this.message,'Succès','success')
        } )
      }
    })
  }
}
