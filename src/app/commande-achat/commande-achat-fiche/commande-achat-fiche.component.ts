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
import { CommandeAchat, GetCommandeAchat } from 'src/app/Models/commande.model';
import { Fournisseur, GetFournisseur } from 'src/app/Models/fournisseur.model';
import { FournisseurService } from 'src/app/Services/fournisseur.service';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Services/produit.service';
import { MatTableDataSource } from '@angular/material/table';
import { Entrepot, GetEntrepot } from 'src/app/Models/entrepot.model';
import { EntrepotService } from 'src/app/Services/entrepot.service';

@Component({
  selector: 'app-commande-achat-fiche',
  templateUrl: './commande-achat-fiche.component.html',
  styleUrls: ['./commande-achat-fiche.component.scss']
})

export class CommandeAChatFicheComponent {

  dataSource!: any
  displayedColumns = [
    'produit_id',
    'quantite',
    'prix_unitaire',
    'prix_total_commande',
    'entrepot_id',
    'date_commande'
  ];

  action:string = 'view';
  commandes!: CommandeAchat;
  message!: any
  
  tbUsers: Utilisateur[] = []
  tbProduit: Produit[] = []
  tbFournisseurs: Fournisseur[] = []
  tbClients: Client[] = [];
  tbPointdeVente: PointsDeVentes[] = []
  tbEntrepot: Entrepot[] = []
  
  tbArticleCommande!: any
  sort: any;
  paginator: any;

  facturecommande: any
  bonDeLivraisoncommande: any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private entrepotService: EntrepotService,
    private fournisseurService: FournisseurService,
    private userService: UsersService,
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
    this.loadEntrepot()
    this.loadFournisseur()
    this.loadProduit()
    this.getArticlesCommande()
    this.getFacturecommande()
    this.getBonLivraisoncommande()
  }


  getFacturecommande(){
    this.commandeService.getOneFacture(this.commandes.commande_achat_id).subscribe(res =>{
      console.log(res.message.pdf_path);
      this.facturecommande = res.message.pdf_path
    })
  }

  getBonLivraisoncommande(){
    this.commandeService.getOneBonLivraison(this.commandes.commande_achat_id).subscribe(res =>{
      console.log(res.message.pdf_path);
      this.bonDeLivraisoncommande = res.message.pdf_path
    })
  }


  impressionFacture() {
    console.log(this.facturecommande);
    
    if (this.facturecommande) {
      try {
        const pdfBase64 = this.facturecommande;
  
        // Vérifier si la chaîne est une base64 valide
        if (!/^data:application\/pdf;base64,/.test(pdfBase64)) {
          console.error("La chaîne Base64 n'est pas valide.");
          return;
        }
  
        // Décoder la chaîne Base64
        const byteCharacters = atob(pdfBase64.split(',')[1]); // Enlever le préfixe "data:application/pdf;base64,"
        const byteArrays = new Uint8Array(byteCharacters.length);
  
        // Remplir le tableau d'octets
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays[i] = byteCharacters.charCodeAt(i);
        }
  
        // Créer le Blob avec le type PDF
        const blob = new Blob([byteArrays], { type: 'application/pdf' });
  
        // Créer un lien pour forcer le téléchargement
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'facture.pdf'; // Nom du fichier à télécharger
        link.click(); // Déclenche le téléchargement
      } catch (error) {
        console.error("Erreur lors du traitement du fichier PDF : ", error);
      }
    } else {
      console.error("Aucune facture disponible.");
    }
  }
  
  


  impressionBonDeLivraison() {
    console.log(this.bonDeLivraisoncommande); // Vérifier la valeur dans la console
    
    if (this.bonDeLivraisoncommande) {
      try {
        const pdfBase64 = this.bonDeLivraisoncommande;
  
        // Vérifier si la chaîne est une base64 valide (si elle contient un préfixe comme "data:application/pdf;base64,")
        if (!/^data:application\/pdf;base64,/.test(pdfBase64)) {
          console.error("La chaîne Base64 n'est pas valide.");
          return;
        }
  
        // Supprimer le préfixe "data:application/pdf;base64," si présent
        const base64Data = pdfBase64.split(',')[1]; 
  
        // Décoder la chaîne base64
        const byteCharacters = atob(base64Data); // Décoder la chaîne base64
        const byteArrays = new Uint8Array(byteCharacters.length); // Créer un tableau d'octets avec la longueur de la chaîne
  
        // Remplir le tableau d'octets
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays[i] = byteCharacters.charCodeAt(i);
        }
  
        // Créer le Blob avec le type PDF
        const blob = new Blob([byteArrays], { type: 'application/pdf' });
  
        // Créer un lien pour forcer le téléchargement
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'bon_de_livraison.pdf'; // Nom du fichier à télécharger
        link.click(); // Déclenche le téléchargement
      } catch (error) {
        console.error("Erreur lors du traitement du fichier PDF : ", error);
      }
    } else {
      console.error("Aucun bon de livraison disponible.");
    }
  }
  
  


    loadEntrepot(){
      const entrepot : GetEntrepot = {entrepot_id: 0}
      this.entrepotService.getListEntrepot(entrepot).subscribe(data => {
        console.log(data.message);
        this.tbEntrepot = data.message
      })
    }
  
    getEntrepotName(entrepot_id: number): string {
      const entrepot = this.tbEntrepot.find(e => e.entrepot_id === entrepot_id);
      return entrepot ? (entrepot.nom ): '';
    }

  getArticlesCommande(){
    const commandeID: GetCommandeAchat = {
      commande_achat_id: this.commandes.commande_achat_id
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
  impressionEtatCommandeAchatPdf() {
    const commande_achat_id: GetCommandeAchat = {
      commande_achat_id: this.commandes.commande_achat_id
    };
    console.log(commande_achat_id);
    this.commandeService.etatcommandeAchat(commande_achat_id).subscribe(response => {
      // Créez un URL pour le blob
      const pdfUrl = URL.createObjectURL(response);
      window.open(pdfUrl, '_blank'); // '_blank' ouvre dans un nouvel onglet ou une nouvelle fenêtre
    }, error => {
      console.error('Erreur lors de la récupération du PDF', error);
    });
  }
  

  getProduitName(produit_id: number): string {
    const produit = this.tbProduit.find(p => p.produit_id === produit_id);
    return produit ? (produit.nom ): '';
  }
  
  loadProduit(){
    const produit : GetProduit = {produit_id: 0}
    this.produitService.getList(produit).subscribe(data => {
      console.log(data.message);
      this.tbProduit = data.message
    })
  }

  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
      
    } )
  }

  getFournisseurName(fournisseur_id: number): string {
    const fournisseur = this.tbFournisseurs.find(f => f.fournisseur_id === fournisseur_id);
    return fournisseur ? fournisseur.nom : 'Unknown Fournisseur';
  }

  loadFournisseur(){
    const fournisseur : GetFournisseur = {fournisseur_id: 0}
    this.fournisseurService.getList(fournisseur).subscribe(data => {
      console.log(data);
      this.tbFournisseurs = data.message
    })
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
