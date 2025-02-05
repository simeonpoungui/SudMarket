import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { ClientsService } from 'src/app/Services/clients.service';
import { UsersService } from 'src/app/Services/users.service';
import {GetPointsDeVentes,PointsDeVentes} from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { CommandeService } from 'src/app/Services/commande.service';
import { ArticlesDeCommandeDAchat, CommandeAchat, GetCommandeAchat } from 'src/app/Models/commande.model';
import { Fournisseur, GetFournisseur } from 'src/app/Models/fournisseur.model';
import { FournisseurService } from 'src/app/Services/fournisseur.service';
import { MatTableDataSource } from '@angular/material/table';
import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit, Produit } from 'src/app/Models/produit.model';

@Component({
  selector: 'app-commande-achat-form',
  templateUrl: './commande-achat-form.component.html',
  styleUrls: ['./commande-achat-form.component.scss'],
})
export class CommandeAChatFormComponent {
  action: string = 'edit';
  commandes!: CommandeAchat;
  message!: any;

  commande_achat_id!: number;
  point_de_vente_id?: number;
  fournisseur_id!: number;
  date_commande?: string;
  statut_validation?: string
  montant_total!: number;
  statut?: string;
  utilisateur_id!: number;

  tbUsers: Utilisateur[] = [];
  tbClients: Client[] = [];
  tbProduit: Produit[] = []
  tbFournisseurs: Fournisseur[] = []
  tbPointdeVente: PointsDeVentes[] = []
  statuts = [
    { value: 'livrée', label: 'Livrée' },
    { value: 'en cours de livraison', label: 'En cours de livraison' },
  ];

  statutsValidation = [
    { value: 'en attente', label: 'En attente' },
    { value: 'validée', label: 'Validée' },
    { value: 'rejetée', label: 'Rejetée' },
  ];

  dataSource!: any
  displayedColumns = [
    'produit_id',
    'quantite',
    'prix_unitaire',
    'prix_total_commande',
    'point_de_vente_id',
    'date_commande',
    'Action'
  ];
  sendIDcommande!: GetCommandeAchat;
  sort: any;
  paginator: any;
  disabelBtnValidate?: string
  isloadingBtnValidateCommande!: boolean

  TbCombinaisons: any[] = []
  ObjetCommande: any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private userService: UsersService,
    private fournisseurService: FournisseurService,
    private clientService: ClientsService,
    private pointService: PointsDeVentesService,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    this.commande_achat_id = this.route.snapshot.params['id']
    console.log(this.commande_achat_id);
    if (this.commande_achat_id) {
      this.getOneCommandeAchat()
    }else{
      console.log(this.action);
      const commandeJSON = localStorage.getItem('selectedCommande');
      if (commandeJSON) {
        this.commandes = JSON.parse(commandeJSON);
        console.log(this.commandes);
        this.disabelBtnValidate = this.commandes.statut
        this.initFormCommande();
      }
    }

    this.loadClient();
    this.loadUsers();
    this.loadPointDeVente();
    this.getArticlesCommande()
    this.loadFournisseur();
    this.loadProduit()
  }
  
  openModal(element:any){
    console.log(element);
    this.ObjetCommande = element
    this.getCombinaisonsByID(element.id)

  }

  getCombinaisonsByID(id: number){
    this.produitService.getCombinaisonById(id).subscribe(res => {
      console.log(res.message);
      if (res.message.id) {
        this.TbCombinaisons = [res.message]
        console.log(this.TbCombinaisons);
      }else{
        this.TbCombinaisons = []
        this.globalService.toastShow("Ceci est un produit simple","Information")
      }
    });
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

    getArticlesCommande(){
      const commandeID: GetCommandeAchat = {
        commande_achat_id: this.commande_achat_id
      }
      this.commandeService.getArticleCommandeByCommandeID(commandeID).subscribe(data => {
        console.log(data.message);
        this.dataSource = new MatTableDataSource(data.message);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        if (typeof data.message === 'string') {
          this.globalService.toastShow('Aucun article commandé','Information','info')
        }
      } )
    }

    

  getOneCommandeAchat(){
    const commande_achat_id: GetCommandeAchat = {
      commande_achat_id: this.commande_achat_id
    }
    this.commandeService.getOne(commande_achat_id).subscribe(res =>{
      console.log(res.message);
      this.disabelBtnValidate = res.message.statut
      this.commande_achat_id = res.message.commande_achat_id;
      this.point_de_vente_id = res.message.point_de_vente_id;
      this.fournisseur_id = res.message.fournisseur_id;
      this.date_commande = res.message.date_commande;
      this.statut_validation = res.message.statut_validation
      this.montant_total = res.message.montant_total;
      this.statut = res.message.statut;
      this.utilisateur_id = res.message.utilisateur_id;
    })
  }

  initFormCommande() {
    this.commande_achat_id = this.commandes.commande_achat_id;
    this.point_de_vente_id = this.commandes.point_de_vente_id;
    this.fournisseur_id = this.commandes.fournisseur_id;
    this.date_commande = this.commandes.date_commande;
    this.montant_total = this.commandes.montant_total;
    this.statut = this.commandes.statut;
    this.utilisateur_id = this.commandes.utilisateur_id;
    this.statut_validation = this.commandes.statut_validation
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
    });
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(
      (p) => p.point_de_vente_id === point_de_vente_id
    );
    return point ? point.nom : 'Unknown Point';
  }

  loadClient() {
    const client: GetClient = { client_id: 0 };
    this.clientService.getListClient(client).subscribe((data) => {
      console.log(data);
      this.tbClients = data.message;
    });
  }

  loadFournisseur() {
    const fournisseur: GetFournisseur = { fournisseur_id: 0 };
    this.fournisseurService.getList(fournisseur).subscribe((data) => {
      console.log(data.message);
      this.tbFournisseurs = data.message;
    });
  }

  loadUsers() {
    const user: GetUser = { utilisateur_id: 0 };
    this.userService.getListUser(user).subscribe((data) => {
      console.log(data);
      this.tbUsers = data.message;
    });
  }

  getFournisseurName(fournisseur_id: number): string {
    const fournisseur = this.tbFournisseurs.find(
      (f) => f.fournisseur_id === fournisseur_id
    );
    return fournisseur ? fournisseur.nom : 'Unknown Fournisseur';
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

  updateCommande() {
    this.isloadingBtnValidateCommande = true
    const Commande: CommandeAchat = {
      commande_achat_id: this.commande_achat_id,
      fournisseur_id: this.fournisseur_id,
      montant_total: this.montant_total,
      utilisateur_id: this.utilisateur_id,
      statut: this.statut,
      date_commande: this.date_commande,
      statut_validation : this.statut_validation
   }
    
     console.log(Commande);
     this.commandeService.update(Commande).subscribe((data) => {
       console.log(data.message);
       if (data.code == 'succes' && Commande.statut == "livrée" && Commande.statut_validation == "validée") {
        this.updateProduitStockBycommande();
        this.isloadingBtnValidateCommande = false
        this.globalService.toastShow(this.message, 'Succès');
        this.router.navigateByUrl('commande/achat/list');
       }else{
        this.isloadingBtnValidateCommande = false
        this.message = data.message
        this.globalService.toastShow(this.message, 'Succès');
        this.router.navigateByUrl('commande/achat/list');
       }
     });
  }

  updateCommandeProduitStock(event: any) {
    console.log(event.target.value);
    this.statut = event.target.value;
    const getIDcommande: GetCommandeAchat = {
      commande_achat_id: this.commandes.commande_achat_id,
    };
    this.sendIDcommande = getIDcommande;
  }

  updateProduitStockBycommande() {
    this.commandeService.updaStatutteProduitStockBySatut(this.sendIDcommande).subscribe((data) => {
        console.log(data.message);
        this.globalService.toastShow('Quantités mise à jour', 'Succès');
        this.router.navigateByUrl('commande/achat/list');
      });
  }

  deleteCommande() {
    const alert = this.dialog.open(AlertComponent);
    alert.componentInstance.content =
      'Voulez-vous supprimé la commande ' +
      this.commandes.commande_achat_id +
      ' ?';
    alert.componentInstance.backgroundColor = 'danger';
    alert.afterClosed().subscribe((confirmDelete) => {
      if (confirmDelete) {
        console.log(this.commandes);
        this.commandeService.delete(this.commandes).subscribe((data) => {
          console.log(data.message);
          this.message = data.message;
          this.router.navigateByUrl('commande/achat/list');
          this.globalService.toastShow(this.message, 'Succès', 'success');
        });
      }
    });
  }
}
